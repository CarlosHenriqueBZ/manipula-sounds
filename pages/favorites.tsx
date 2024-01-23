import Page from '@/components/page'
import { Track } from '@/utils/interfaces'
import {
  Badge,
	Box,
	Button,
	Heading,
	IconButton,
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalFooter,
	ModalHeader,
	ModalOverlay,
	Tooltip,
	useColorMode,
	useDisclosure,
  useToast,
} from '@chakra-ui/react'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { Heart, Menu, Music, Plus, TrendingUp, X } from 'react-feather'

const Favorites = () => {
	const { colorMode } = useColorMode()
	const { isOpen, onOpen, onClose } = useDisclosure()
  const [favoritesArray, setFavorites] = useState<Track[]>([])
const [settedFavorite, setSettedFavorite] = useState<Track | null>(null)

  const [songTitle, setSongTitle] = useState<string>()

	let favorites: any

  const toast = useToast()
  
  const handleClickFavorites = () => {
		if (!settedFavorite) {
			throw new Error('settedFavorite is null')
		}

		const storedFavorites = localStorage.getItem('favorites')
		const prevFavorites: Track[] = storedFavorites
			? JSON.parse(storedFavorites)
			: []

		const updatedFavorites = prevFavorites.filter(
			(favMoment) => favMoment.id !== settedFavorite.id,
		)

		setFavorites(updatedFavorites)

		localStorage.setItem('favorites', JSON.stringify(updatedFavorites))

		onClose()

		toast({
			title: ` ${songTitle} Removido dos favoritos`,
			status: 'success',
			duration: 3000,
			position: 'top',
			isClosable: true,
		})
	}

  const handleOpenModalRemove = (favorite: Track) => {
    setSongTitle(favorite.title)
    setSettedFavorite(favorite)
    onOpen()
  }

  useEffect(() => {
	if (typeof window !== 'undefined') {
		favorites = JSON.parse(localStorage.getItem('favorites') || '[]')
    setFavorites(favorites)
	} else {
     setFavorites([])
	}
	}, [])

	return (
		<Page>
			{favoritesArray.length > 0 && (
				<>
					<div className='mt-2 mb-8'>
						<div className='mt-2 mx-auto flex  items-center justify-center'>
							<h1 className='text-4xl font-bold tracking-tight text-white-900 sm:text-6xl'>
								Favoritos
							</h1>
							<Badge variant='solid' className='ml-2' colorScheme='green'>
								{favoritesArray.length}
							</Badge>
						</div>
					</div>
				</>
			)}

			{favoritesArray?.length ? (
				<>
					<div className='grid grid-cols-1 md:grid-cols-3 gap-4 justify-center'>
						{favoritesArray?.map((favorite: Track, index: number) => (
							<Box key={index} className='mb-4 mx-auto max-w-2xl lg:max-w-7xl'>
								<div className='relative mx-auto max-w-2xl lg:max-w-7xl'>
									<div className='grid grid-cols'>
										<div className='cursor-pointer aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-lg bg-gray-200 xl:aspect-h-8 xl:aspect-w-7'>
											<img
												src={favorite.album.cover_big}
												alt={favorite.album.title}
												className='h-full w-full object-cover object-center group-hover:opacity-75 group-hover:shadow-md'
											/>
											<Box position='absolute' top='1' right='1'>
												<Tooltip label='Remover Favorito' placement='top'>
													<IconButton
														aria-label='Remover Favorito'
														icon={<X />}
														onClick={() => handleOpenModalRemove(favorite)}
														bg={`${colorMode === 'dark' ? 'white' : 'dark'}`}
														color={`${colorMode === 'dark' ? 'white' : 'dark'}`}
													/>
												</Tooltip>
											</Box>
										</div>
									</div>
								</div>
							</Box>
						))}
					</div>
				</>
			) : (
				<div className='relative overflow-hidden'>
					<div className='pb-80 pt-16 sm:pb-40 sm:pt-24 lg:pb-48 lg:pt-40'>
						<div className='relative mx-auto max-w-7xl px-4 sm:static sm:px-6 lg:px-8'>
							<div className='sm:max-w-lg'>
								<h1 className='text-4xl font-bold tracking-tight text-white-900 sm:text-6xl'>
									Nenhum favorito encontrado
								</h1>
								<div className='mt-2 mx-auto flex  items-center justify-left'>
									<p className='mt-4 text-xl text-white-500'>
										Adicione favoritos em{' '}
									</p>
									<Link className='mt-4 text-xl text-white-500 ml-1' href='/'>
										<b>Bombando</b>
									</Link>

									<TrendingUp className='ml-2 align-center' />
								</div>
							</div>
						</div>
					</div>
				</div>
			)}

			<Modal
				isCentered
				onClose={onClose}
				isOpen={isOpen}
				motionPreset='slideInBottom'
			>
				<ModalOverlay />
				<ModalContent>
					<ModalHeader color={'black'}>Remover Favorito</ModalHeader>
					<ModalCloseButton color={'black'} />
					<ModalBody>
						<Heading color={'black'} fontSize='3xl'>
							Você tem certeza que deseja remover {songTitle}?
						</Heading>
					</ModalBody>
					<ModalFooter>
						<Button variant='ghost' onClick={onClose}>
							Fechar
						</Button>
						<Button
							colorScheme='red'
							mr={3}
							onClick={() => handleClickFavorites()}
						>
							Remover Favorito
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
		</Page>
	)
}
export default Favorites
