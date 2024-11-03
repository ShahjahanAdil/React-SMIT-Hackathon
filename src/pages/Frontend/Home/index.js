import React from 'react'
import heroImg from '../../../assets/images/hero-img.png'
import { Link, useNavigate } from 'react-router-dom'
import { images } from '../../../assets/images'
import { MdOutlineEmail } from 'react-icons/md'
import { FaArrowRightLong } from 'react-icons/fa6'
import CartButton from '../../../components/CartButton'

export default function Home() {

    const navigate = useNavigate()

    return (
        <>
            <div className='home'>
                <section className='home-section'>
                    <div className="hero">
                        <div className="hero-content">
                            <div className="hero-left">
                                <h1>MASTER RESTAURANT</h1>
                                <p className='mt-2'>We got everthing you need. You can find all kind of fresh meal on our website on cheapest rates. 100% certified items are present with fantastics taste.</p>
                                <Link to='/products' className='link mt-3'><span className='d-flex align-items-center gap-2'>See Products <FaArrowRightLong /></span></Link>
                            </div>
                            <div className="hero-right">
                                <img src={heroImg} alt="main-image" />
                            </div>
                        </div>
                    </div>
                </section>

                <marquee behavior='scroll' direction='right'>
                    <div className='marquee-div'>
                        <img src={images.kfc} alt='dell' />
                        <img src={images.mcdonald} alt='hp' />
                        <img src={images.pizzahut} alt='lenovo' />
                        <img src={images.subway} alt='asus' />
                        <img src={images.dominos} alt='acer' />
                    </div>
                </marquee>

                <div className="home-container">
                    <section className='category-section'>
                        <h3>Search by category</h3>
                        <div className="home-categories">
                            <div className="home-category" style={{ cursor: 'pointer', padding: '20px' }} onClick={() => navigate('/products/category/pizza')}>
                                <img src={images.pizza} alt="pizza" />
                                <p className='gap-1'>Pizza <FaArrowRightLong /></p>
                            </div>
                            <div className="home-category" style={{ cursor: 'pointer', padding: '20px' }} onClick={() => navigate('/products/category/burger')}>
                                <img src={images.burger} alt="burger" />
                                <p className='gap-1'>Burger <FaArrowRightLong /></p>
                            </div>
                            <div className="home-category" style={{ cursor: 'pointer', padding: '20px' }} onClick={() => navigate('/products/category/pasta')}>
                                <img src={images.pasta} alt="pasta" />
                                <p className='gap-1'>Pasta <FaArrowRightLong /></p>
                            </div>
                            <div className="home-category" style={{ cursor: 'pointer', padding: '20px' }} onClick={() => navigate('/products/category/shawarma')}>
                                <img src={images.shawarma} alt="shawarma" />
                                <p className='gap-1'>Shawarma <FaArrowRightLong /></p>
                            </div>
                        </div>
                        <div className='text-center mb-4'>
                            <div className="see-products-btn" onClick={() => navigate('/products')}><span className='d-flex align-items-center gap-2'>See All Products <FaArrowRightLong /></span></div>
                        </div>
                    </section>

                    <section className='companies-section'>
                        <h3>BRAND PRODUCTS</h3>
                        <div className="home-companies">
                            <div className="home-company" style={{ cursor: 'pointer' }} onClick={() => navigate('/products/brand/kfc')}>
                                <div className='overlay'></div>
                                <img src={images.kfcBanner} alt="kfc" />
                                <p className='gap-1'>KFC <FaArrowRightLong /></p>
                            </div>
                            <div className="home-company" style={{ cursor: 'pointer' }} onClick={() => navigate('/products/brand/mcdonald')}>
                                <div className='overlay'></div>
                                <img src={images.mcdonaldBanenr} alt="mcdonald" />
                                <p className='gap-1'>MC DONALD'S <FaArrowRightLong /></p>
                            </div>
                            <div className="home-company" style={{ cursor: 'pointer' }} onClick={() => navigate('/products/brand/pizzahut')}>
                                <div className='overlay'></div>
                                <img src={images.pizzahutBanner} alt="pizzahut" />
                                <p className='gap-1'>PIZZA HUT <FaArrowRightLong /></p>
                            </div>
                            <div className="home-company" style={{ cursor: 'pointer' }} onClick={() => navigate('/products/brand/dominos')}>
                                <div className='overlay'></div>
                                <img src={images.domniosBanner} alt="dominos" />
                                <p className='gap-1'>DOMINOS <FaArrowRightLong /></p>
                            </div>
                        </div>
                        <div className='text-center mb-4'>
                            <div className="see-products-btn" onClick={() => navigate('/products')}><span className='d-flex align-items-center gap-2'>See All Products <FaArrowRightLong /></span></div>
                        </div>
                    </section>
                </div>

                <section className='about-section' id='about'>
                    <div className="about-div about-1">
                        <div className="about-box">
                            <img src={images.onlineShopping} alt="" />
                            <div>
                                <h5>ONLINE SHOP</h5>
                                <p>Shop everthing online from here.</p>
                            </div>
                        </div>
                    </div>
                    <div className="about-div about-2">
                        <div className="about-box">
                            <img src={images.securePayments} alt="" />
                            <div>
                                <h5>SECURE PAYMENTS</h5>
                                <p>Shop everthing online from here.</p>
                            </div>
                        </div>
                    </div>
                    <div className="about-div about-3">
                        <div className="about-box">
                            <img src={images.globalProducts} alt="" />
                            <div>
                                <h5>GLOBAL PRODUCTS</h5>
                                <p>Shop everthing online from here.</p>
                            </div>
                        </div>
                    </div>
                </section>

                <div className="home-container">
                    <section className='contact-section mt-5' id='contact'>
                        <p className='text-center' style={{ fontWeight: '600' }}>NEED HELP?</p>
                        <h3 className='text-center'>CONTACT US</h3>
                        <div className="contact-box">
                            <div className="contact-left">
                                <img src={images.contact} alt="contact" />
                            </div>
                            <div className="contact-right">
                                <input type="text" name="fullname" id="fullname" placeholder='Enter your fullname' />
                                <input type="text" name="email" id="email" placeholder='Enter your email' />
                                <textarea name="message" id="message" rows='10' style={{ resize: 'none' }} placeholder='Enter your message'></textarea>
                                <button><span className='d-flex align-items-center gap-1'><MdOutlineEmail /> Send Message</span></button>
                            </div>
                        </div>
                    </section>
                </div>
            </div>

            <CartButton />
        </>
    )
}