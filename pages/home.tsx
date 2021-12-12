import type { NextPage } from 'next'
import Filter from '../components/Filter'
import Footer from '../components/Footer'
import Header from '../components/Header'

const Home: NextPage = () => {

  return (
    <>
      <Header/>
      <Filter />
      <Footer/>
    </>
  )
}

export default Home


