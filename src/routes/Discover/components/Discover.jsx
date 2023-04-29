import React, { useEffect, useState } from 'react';
import DiscoverBlock from './DiscoverBlock/components/DiscoverBlock';
import '../styles/_discover.scss';
import ApiClient from '../../../utils/ApiClient';

const Discover = () => {

  const [newReleases, setNewReleases] = useState({
    isLoading: true,
    items : []
  })
  const [playlists, setPlaylists] = useState({
    isLoading: true,
    items : []
  })
  const [categories, setCategories] = useState({
    isLoading: true,
    items : []
  })

  const fetchFeaturedPlaylist = async () => {
    const resp = await ApiClient.get('/browse/featured-playlists')

    setPlaylists({
      isLoading: false,
      items: resp.data.playlists.items
    })
  }

  const fetchNewRelases = async () => {
    const resp = await ApiClient.get('/browse/new-releases')

    setNewReleases({
      isLoading: false,
      items: resp.data.albums.items
    })
  }

  const fetchCategories = async () => {

    const resp = await ApiClient.get('/browse/categories')

    setCategories({
      isLoading: false,
      items: resp.data.categories.items
    })
  }

  useEffect(() => {
    ApiClient.onAccessTokenGenerated(() => {
      fetchFeaturedPlaylist()
      fetchNewRelases()
      fetchCategories()
    })
  }, [])


  return (
    <div className="discover">
      <DiscoverBlock text="RELEASED THIS WEEK" id="released" data={newReleases.items} isLoading={newReleases.isLoading} />
      <DiscoverBlock text="FEATURED PLAYLISTS" id="featured" data={playlists.items} isLoading={playlists.isLoading} />
      <DiscoverBlock text="BROWSE" id="browse" data={categories.items} imagesKey="icons" isLoading={categories.isLoading}/>
    </div>
  );
}

export default Discover
