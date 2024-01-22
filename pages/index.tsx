import { useState } from 'react';
import Page from '@/components/page';
import { UilPlus } from '@iconscout/react-unicons';
import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';
import useWindowDimensions from '../utils/useWindowDimensions';
import api from '@/utils/api';
import { DeezerTrackData, Track } from '@/utils/interfaces'
import Notification from './../components/notification';

interface CardProps {
  moment: Track;
  onOpenPlayer: (track: DeezerTrackData) => void;
}

const Card: React.FC<CardProps> = ({ moment, onOpenPlayer }) => {
	function formatDuration(time: number) {
		const minutes = Math.floor((time % 3600) / 60)
		const lessSeconds = time % 60

		return `${minutes}:${lessSeconds}`
	}

	const [activePopover, setActivePopover] = useState<number>(0)
  const [favorites, setFavorites] = useState<Track[]>([])

const togglePopover = (popoverId: number) => {
	setActivePopover((prevActivePopover) => {
		return prevActivePopover === popoverId ? null : popoverId
	})
}

	const handleClickFavorites = (favorite: Track) => {
		setFavorites((prevFavorites: Track[] | null) => {
			const currentFavorites = prevFavorites || []

			const isMomentInFavorites = currentFavorites.some(
				(favMoment) => favMoment.id === favorite.id,
			)

			if (isMomentInFavorites) {
				return currentFavorites.filter(
					(favMoment) => favMoment.id !== favorite.id,
				)
			} else {
				return [...currentFavorites, favorite]
			}
		})
	}

	const handleClickInteger = (link: string) => {
		if (link) {
			window.open(link, '_blank')
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
							onClick={() => onOpenPlayer(moment.preview)}
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
								<div className='relative inline-block cursor-pointer text-left'>
  <UilPlus
    className='border-gray-300 '
    onClick={() => togglePopover(moment.id)}
  />

  {activePopover === moment.id && (
    <div
      key={moment.id}
      className='origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5'
    >
      <div
        className='py-1'
        role='menu'
        aria-orientation='vertical'
        aria-labelledby='options-menu'
      >
        {favorites?.some(
          (favMoment: Track[]) => favMoment.id === moment.id,
        ) ? (
          <a
            className='block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900'
            role='menuitem'
            onClick={() => handleClickFavorites(moment)}
          >
            Remover dos Favoritos
          </a>
        ) : (
          <a
            className='block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900'
            role='menuitem'
            onClick={() => handleClickFavorites(moment as [])}
          >
            Adicionar aos Favoritos
          </a>
        )}
        <a
          href='#'
          onClick={() => handleClickInteger(moment.link)}
          className='block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900'
          role='menuitem'
        >
          Ouvir na Integra
        </a>
      </div>
    </div>
  )}
</div>
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

const Index = ({ data }) => {
  const [openTrack, setOpenTrack] = useState(false);
  const [selectedTrack, setSelectedTrack] = useState(null);
  const { width } = useWindowDimensions();
  const isMobile = width <= 768;

  const handleOpenPlayer = (track: Track[]) => {
    setSelectedTrack(track);
    setOpenTrack(true);
  };

  const [searchTerm, setSearchTerm] = useState('');

  const filteredMoments = data.tracks?.data?.filter((item) => {
    return (
      item.artist.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const dataTracks = filteredMoments ? filteredMoments : data.tracks?.data;
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
						{dataTracks?.map((moment, index) => (
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
};

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