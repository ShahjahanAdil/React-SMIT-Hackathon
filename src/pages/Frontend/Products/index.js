import React, { useEffect, useState } from 'react'
import Topbar from '../../../components/TopBar'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { FaArrowRight } from 'react-icons/fa6'
import { CiSearch } from 'react-icons/ci'
import { collection, getDocs, orderBy, query } from 'firebase/firestore'
import { firestore } from '../../../config/firebase'
import Loader from '../../../components/Loader'
import { BsArrowDown } from 'react-icons/bs'
import { CgArrowRight } from 'react-icons/cg'
import { TbFilter } from 'react-icons/tb'
import { LuArrowDownWideNarrow } from 'react-icons/lu'
import CartButton from '../../../components/CartButton'

export default function Products() {

    const { selectedCategory, selectedBrand } = useParams()
    const [products, setProducts] = useState([])
    const [filteredProducts, setFilteredProducts] = useState([])
    const [searchQuery, setSearchQuery] = useState('')
    const [limit, setLimit] = useState(15)
    const [reset, setReset] = useState(false)
    const [loading, setLoading] = useState(false)
    const [imageLoaded, setImageLoaded] = useState(false)
    const [showCategoriesFilter, setShowCategoriesFilter] = useState(false)
    const [showBrandsFilter, setShowBrandsFilter] = useState(false)
    const navigate = useNavigate()

    useEffect(() => {
        const fetchItems = async () => {
            setLoading(true)

            try {
                const productsCollection = collection(firestore, "items")
                const q = query(productsCollection, orderBy('dateCreated', 'desc'));

                const querySnapshot = await getDocs(q);
                let productsArray = querySnapshot.docs.map((doc, i) => ({ ...doc.data() }))

                setProducts(productsArray)
            }
            catch (err) {
                console.error(err)
            }
            finally {
                setLoading(false)
            }
        }
        fetchItems()
    }, [])

    useEffect(() => {
        if (selectedCategory) {
            let categoryProducts = products.filter(product => product.category.toLowerCase().includes(selectedCategory))
            setFilteredProducts(categoryProducts)
        }
        else if (selectedBrand) {
            let brandProducts = products.filter(product => product.brand.toLowerCase().includes(selectedBrand))
            setFilteredProducts(brandProducts)
        }
        else {
            setFilteredProducts(products.slice(0, limit))
        }
    }, [products, limit, selectedCategory, selectedBrand, reset])

    const handleSearch = e => {
        e.preventDefault()

        if (searchQuery) {
            const filtered = products.filter(product => product.description.toLowerCase().includes(searchQuery.toLowerCase()))
            setFilteredProducts(filtered.slice(0, limit))
        }
        else {
            setFilteredProducts(products.slice(0, limit))
        }
    }

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-PK', {
            style: 'currency',
            currency: 'PKR',
            maximumFractionDigits: 0,
        }).format(amount);
    };

    if (loading) {
        return <Loader />
    }

    return (
        <>
            <Topbar title={'Products'} />

            <main>
                <div className="products-search-filter-small">
                    <div className='search-small'>
                        <form onSubmit={handleSearch}>
                            <div className='search-bar'>
                                <input type="text" name="search" id="search" value={searchQuery} placeholder='Type to search' onChange={(e) => setSearchQuery(e.target.value)} />
                                <CiSearch className='search-icon' style={{ cursor: 'pointer' }} onClick={handleSearch} />
                            </div>
                        </form>
                    </div>

                    <div className='filter-options'>
                        <p className='d-flex align-items-center gap-1'>Filter <TbFilter />:</p>

                        <button onClick={() => setShowCategoriesFilter(!showCategoriesFilter)} className='d-flex align-items-center gap-1'>Categories <LuArrowDownWideNarrow />
                            <span className="categories-small" style={{ opacity: showCategoriesFilter ? '1' : '0' }}>
                                {
                                    ['Burgers', 'Pizzas', 'Pastas', 'Shawarmas', 'Kababs', 'Tikkas'].map((category) => {
                                        return (
                                            <Link to={`/products/category/${category.toLowerCase()}`} className='category-small-link link' key={category} onClick={() => setShowCategoriesFilter(!showCategoriesFilter)}>{category}</Link>
                                        )
                                    })
                                }
                            </span>
                        </button>

                        <button onClick={() => setShowBrandsFilter(!showBrandsFilter)} className='d-flex align-items-center gap-1'>Brands <LuArrowDownWideNarrow />
                            <span className="categories-small" style={{ opacity: showBrandsFilter ? '1' : '0' }}>
                                {
                                    ['Kfc', 'McDonalds', 'Dominos', 'Subway', 'PizzaHut'].map((brand) => {
                                        return (
                                            <Link to={`/products/brand/${brand.toLowerCase()}`} key={brand} className='category-small-link link' onClick={() => setShowBrandsFilter(!showBrandsFilter)}>{brand}</Link>
                                        )
                                    })
                                }
                            </span>
                        </button>
                    </div>
                </div>

                <div className="products-container">
                    <div className="categories-container">

                        <h6>Search:</h6>
                        <form onSubmit={handleSearch}>
                            <div className='search-bar'>
                                <input type="text" name="search" id="search" value={searchQuery} placeholder='Type to search' onChange={(e) => setSearchQuery(e.target.value)} />
                                <CiSearch className='search-icon' style={{ cursor: 'pointer' }} onClick={handleSearch} />
                            </div>
                        </form>

                        <h6 className='mt-3'>Categories:</h6>
                        <div className='categories-box'>
                            {
                                ['Burgers', 'Pizzas', 'Pastas', 'Shawarmas', 'Kababs', 'Tikkas'].map((category, i) => {
                                    return (
                                        <div className="category-div" key={i}>
                                            <Link to={`/products/category/${category.toLowerCase()}`} className='category-link link'>{category}</Link>
                                        </div>
                                    )
                                })
                            }
                        </div>

                        <h6 className='mt-4'>Brands:</h6>
                        <div className='categories-box'>
                            {
                                ['Kfc', 'McDonalds', 'Dominos', 'Subway', 'PizzaHut'].map((brand, i) => {
                                    return (
                                        <div className="category-div" key={i}>
                                            <Link to={`/products/brand/${brand.toLowerCase()}`} className='category-link link'>{brand}</Link>
                                        </div>
                                    )
                                })
                            }
                        </div>
                    </div>

                    <div className="products-boxes">
                        <div className="products-grid">
                            {filteredProducts.length > 0 ?
                                (
                                    filteredProducts.map(prod => {
                                        const { itemID, itemImage, title, price } = prod

                                        return (
                                            <div className="product-box" key={itemID} style={{ opacity: imageLoaded ? '1' : '0.5' }} onClick={() => navigate(`/product/${itemID}`)}>
                                                <div className="prod-img">
                                                    <img src={itemImage} alt={title} loading='lazy'
                                                        onLoad={() => setImageLoaded(true)}
                                                    />
                                                </div>
                                                <div className="prod-content">
                                                    <p className='prod-heading'>{title}</p>
                                                    <div className='d-flex justify-content-between'>
                                                        <p><span>Price:</span> <span id='price'>{formatCurrency(price)}</span></p>
                                                        <p className='see-details'><FaArrowRight /></p>
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    })
                                )
                                :
                                <>
                                    <div className='no-product'>
                                        <p>There is no product found.</p>
                                    </div>
                                    <div>
                                        <Link to='/products' onClick={() => { setSearchQuery(''); setReset(!reset) }} className='link' style={{ display: 'inline-block', padding: '5px 20px', borderRadius: '30px', backgroundColor: '#7dcab3', color: '#efefef' }}>See all products <CgArrowRight /></Link>
                                    </div>
                                </>
                            }
                        </div>

                        {filteredProducts.length > 0 && limit <= filteredProducts.length && (
                            <div className="text-center">
                                <button
                                    className='mt-5'
                                    style={{ padding: '5px 15px', backgroundColor: '#7dcab3', color: '#fafafa', borderRadius: '30px' }}
                                    onClick={() => setLimit(prevLimit => prevLimit + 15)}
                                >
                                    <span className='d-flex justify-content-center align-items-center gap-2'>Load more <BsArrowDown /></span>
                                </button>
                            </div>
                        )}
                    </div>

                </div>
            </main>

            <CartButton />
        </>
    )
}