import { useEffect, useState } from 'react';
import Page from '@/components/page';
import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';
import useWindowDimensions from '../utils/useWindowDimensions';
import api from '@/utils/api';
import { Payload, Track } from '@/utils/interfaces'
 import { Heart, Music, Plus } from 'react-feather'
import { IconButton, Menu, MenuButton, MenuItem, MenuList, useColorMode, useToast } from '@chakra-ui/react';
interface CardProps {
	moment: Track
	onOpenPlayer: (track: Track[]) => void
}


const Card: React.FC<CardProps> = ({ moment, onOpenPlayer }) => {
	const toast = useToast()

	 const { colorMode } = useColorMode()
	 
	function formatDuration(time: number) {
		const minutes = Math.floor((time % 3600) / 60)
		const lessSeconds = time % 60

		return `${minutes}:${lessSeconds}`
	}

const [favorites, setFavorites] = useState<Track[]>([])


	const handleClickFavorites = (favorite: Track) => {
		const storedFavorites = localStorage.getItem('favorites')
		const prevFavorites: Track[] = storedFavorites
			? JSON.parse(storedFavorites)
			: []

		const isMomentInFavorites = prevFavorites.some(
			(favMoment) => favMoment.id === favorite.id,
		)

		let updatedFavorites: Track[]

		if (isMomentInFavorites) {
			updatedFavorites = prevFavorites.filter(
				(favMoment) => favMoment.id !== favorite.id,
			)
			toast({
				title: 'Removido dos favoritos',
				status: 'warning', // ou 'success' dependendo do seu design
				duration: 3000,
				position: 'top',
				isClosable: true,
			})
		} else {
			updatedFavorites = [...prevFavorites, favorite]
			toast({
				title: 'Adicionado aos favoritos',
				status: 'success',
				position: 'top',
				duration: 3000,
				isClosable: true,
			})
		}

		setFavorites(updatedFavorites)
		localStorage.setItem('favorites', JSON.stringify(updatedFavorites))
	}

	const handleClickInteger = (link: string) => {
		if (link) {
			window.open(link, '_blank')
		}
	}

	const isMomentInFavorites = (momentId: number): boolean => {
		if (typeof localStorage !== 'undefined') {
			const storedFavorites = localStorage.getItem('favorites')
			const favorites: Track[] = storedFavorites
				? JSON.parse(storedFavorites)
				: []

			return favorites.some((favMoment) => favMoment.id === momentId)
		} else {
			return false
		}
	}

	return (
		<>
			<div className=''>
				<div className='mx-auto max-w-2xl lg:max-w-7xl '>
					<div className='grid grid-cols'>
						<a
							key={moment.id}
							className='group'
							onClick={() => onOpenPlayer([moment])}
						>
							<div className='cursor-pointer aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-lg bg-gray-200 xl:aspect-h-8 xl:aspect-w-7'>
								<img
									src={moment.album.cover_big}
									alt={moment.album.title}
									className='h-full w-full object-cover object-center group-hover:opacity-75 group-hover:shadow-md'
								/>
							</div>

							<div className=' mt-2 mx-auto flex  items-center justify-between'>
								<p className='text-lg font-medium text-white-900'>
									{moment.artist.name}
								</p>
								<Menu>
									<MenuButton
										as={IconButton}
										aria-label='Options'
										icon={<Plus size={20} />}
										size={'25px'}
										bg={`${colorMode === 'dark' ? 'white' : 'dark'}`}
										color={`${colorMode === 'dark' ? 'white' : 'dark'}`}
									/>
									<MenuList>
										<MenuItem
											isDisabled={isMomentInFavorites(moment.id)}
											color={'black'}
											onClick={() => handleClickFavorites(moment)}
											icon={<Heart size={16} />}
										>
											Adicionar aos Favoritos
										</MenuItem>
										<MenuItem
											color={'black'}
											onClick={() => handleClickInteger(moment.link)}
											icon={<Music size={16} />}
										>
											Ouvir na Integra
										</MenuItem>
									</MenuList>
								</Menu>
							</div>

							<h3 className='text-sm text-white-700'>{moment.title}</h3>
							<div className='flex items-center gap-x-4 text-xs'>
								<time
									dateTime={formatDuration(moment.duration)}
									className='text-gray-500'
								>
									{formatDuration(moment.duration)}
								</time>
							</div>
						</a>
					</div>
				</div>
			</div>
		</>
	)
}

const Index: React.FC<{ data: Payload }> = ({ data }) => {
	const [openTrack, setOpenTrack] = useState(false)
	const [selectedTrack, setSelectedTrack] = useState<string | null>(null)
	const { width } = useWindowDimensions()
	const isMobile = width <= 768
	const [filteredData, setFilteredData] = useState([])

	const handleOpenPlayer = (tracks: Track[]) => {
		if (tracks && tracks.length > 0) {
			setSelectedTrack(tracks[0].preview)
			setOpenTrack(true)
		}
	}
	
	const [searchTerm, setSearchTerm] = useState('')
	
	const filteredMoments = data.tracks?.data?.filter((item) => {
		return (
			item.artist.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
			item.title.toLowerCase().includes(searchTerm.toLowerCase())
		)
	})

	 useEffect(() => {
			const fetchData = async () => {
				try {
					const response = await api.get(`/search?q=${searchTerm}`)
					const data = response.data
					setFilteredData(data.tracks?.data || [])
				} catch (error) {
					console.error('Erro ao buscar dados da API:', error)
					setFilteredData([])
				}
			}

			fetchData()
		}, [searchTerm])


	const dataTracks = filteredMoments ? filteredMoments : data.tracks?.data
	return (
		<>
			<Page>
				<form>
					<div className='flex mb-6'>
						<div className='relative w-full'>
							<input
								type='text'
								placeholder='Pesquisar...'
								value={searchTerm}
								onChange={(e) => setSearchTerm(e.target.value)}
								className='w-full h-10 pl-4 pr-10 border rounded-full focus:outline-none focus:border-zinc-300 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white'
							/>
						</div>
					</div>
				</form>
				{dataTracks?.length ? (
					<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'>
						{dataTracks?.map((moment: Track, index: number) => (
							<Card
								key={index}
								moment={moment}
								onOpenPlayer={handleOpenPlayer}
							/>
						))}
					</div>
				) : (
					<div className='relative overflow-hidden'>
						<div className='pb-80 pt-16 sm:pb-40 sm:pt-24 lg:pb-48 lg:pt-40'>
							<div className='relative mx-auto max-w-7xl px-4 sm:static sm:px-6 lg:px-8'>
								<div className='sm:max-w-lg'>
									<h1 className='text-4xl font-bold tracking-tight text-white-900 sm:text-6xl'>
										Nenhum resultado encontrado
									</h1>
									<p className='mt-4 text-xl text-white-500'>
										Não foram encontrados nenhum resultado para sua busca de{' '}
										{searchTerm}
									</p>
								</div>
							</div>
						</div>
					</div>
				)}
			</Page>

			<div className='hidden sm:block'>
				<nav className='fixed bottom-0 w-full border-t bg-zinc-100 pb-safe dark:border-zinc-800 dark:bg-zinc-900'>
					<div className='mx-auto flex  items-center px-6'>
						{openTrack && selectedTrack && !isMobile && (
							<AudioPlayer
								className='w-full'
								autoPlay
								src={selectedTrack}
								layout={'horizontal'}
							/>
						)}
					</div>
				</nav>
			</div>

			{isMobile && openTrack && (
				<div className=''>
					<nav className='fixed bottom-20 w-full border-t bg-zinc-100 pb-safe dark:border-zinc-800 dark:bg-zinc-900'>
						<div className='mx-auto flex h-16 max-w-md items-center justify-around px-6'>
							{openTrack && selectedTrack && isMobile && (
								<AudioPlayer
									className='w-full'
									autoPlay
									src={selectedTrack}
									layout={'horizontal'}
								/>
							)}
						</div>
					</nav>
				</div>
			)}
		</>
	)
}

export async function getServerSideProps() {
  try {
    const response = await api.get('/chart');
    const data = response.data;

    return {
      props: {
        data,
      },
    };
  } catch (error) {
    console.error('Erro ao buscar dados da API:', error);
    return {
      props: {
        data: null,
      },
    };
  }
}




export default Index;