import React, { useRef, useState, useEffect } from 'react'
import Link from 'next/link'
import { PiShoppingCart } from "react-icons/pi";
import { IoMdCloseCircle } from "react-icons/io";
import { FaCirclePlus } from "react-icons/fa6";
import { AiFillMinusCircle } from "react-icons/ai";
import { IoBagCheck } from "react-icons/io5";
import { MdAccountCircle } from "react-icons/md";
import { useRouter } from 'next/router';
function Navbar({logout, user, cart, addtoCart, removefromCart, subtotal, clearCart}) {

  const [dropDown, setdropDown] = useState(false)
  const [sidebar, setsidebar] = useState(false)
  const router = useRouter();

  const toogleCart = () => {
    setsidebar(!sidebar)
  }

  useEffect(() => {
    Object.keys(cart).length !== 0 && setsidebar(true)
    let extended = ['/checkout', '/order', '/userorders']
    if (extended.includes(router.pathname)) {
      setsidebar(false)
    }
    },[])

  const ref = useRef();
  return (
    <>
     <div  className="cart z-20 items-center flex space-x-4 cursor-pointer fixed top-6 md:text-2xl right-0 mr-6">
    <a onMouseOver={()=>{setdropDown(true)}} onMouseLeave={()=>{setdropDown(false)}}>
    {dropDown && <div className="absolute top-5 shadow-lg rounded-lg w-32 px-5 right-11 bg-blue-100">
      <ol>
       <Link href={"/myaccount"}> <li className='text-sm py-1 font-bold hover:text-blue-700'>My Account</li></Link>
       <Link href={"/userorders"}>  <li className='text-sm py-1 font-bold hover:text-blue-700'>Orders</li></Link>
        <li onClick={logout} className='text-sm py-1 font-bold hover:text-blue-700'>Logout</li>
      </ol>
    </div>}
    {user.value && <div> <MdAccountCircle /></div>}
     </a>
    {!user.value && <Link className='text-xs md:text-sm font-bold bg-blue-500 rounded-md p-1 hover:bg-blue-700 text-white md:p-1.5' href={'/login'}>Login</Link>}
        <PiShoppingCart onClick={toogleCart} />
      </div>
    <div className={`flex flex-col z-10 p-5 justify-center top-0 fixed bg-white w-full items-center md:justify-start md:flex-row shadow-md ${!sidebar && "overflow-hidden"}`}>
      <div className="left relative bottom-1 right-2 md:bottom-0 md:right-0 font-extrabold mr-auto text-blue-700 md:mx-10">
        <Link href={"/"} className='text-2xl mr-auto flex'> <IoBagCheck className='m-1 mr-auto'/> Yourcart.com</Link>
      </div>
      <div className="right">
        <ul className='flex space-x-10 text-sm md:text-md'>
          <Link href={"/tshirts"}><li className=' hover:text-blue-700 cursor-pointer font-bold'>Tshirts</li></Link>
          <Link href={"/hoodie"}><li className=' hover:text-blue-700 cursor-pointer font-bold'>Hoodies</li></Link>
          <Link href={"/mugs"}><li className=' hover:text-blue-700 cursor-pointer font-bold'>Accessories</li></Link>
          <Link href={"/stickers"}><li className=' hover:text-blue-700 cursor-pointer font-bold'>Pants</li></Link>
        </ul>
      </div>

     
    </div>
      <div ref={ref}  className={`sidebar !z-50  px-8 h-full w-72 transition-all fixed bg-blue-100 top-0 p-10  ${!sidebar ? "-right-72" : "right-0"}`}>
        <h2 className='font-bold z-50 text-xl text-center '>Shooping Cart</h2>
        <span onClick={toogleCart} className='absolute z-50 text-xl cursor-pointer top-2 right-2 '>< IoMdCloseCircle /></span>
        <ol className='list-decimal font-semibold'>
          {Object.keys(cart).length == 0 && <div className='my-6 text-lg'>Your Cart is Empty!</div>}
          {Object.keys(cart).map((k)=>{return <li key={k}>
            <div className="item flex my-5">
              <div className='w-2/3 font-semibold'>{cart[k].name} {cart[k].size}/{cart[k].variant}</div>
              <div className='w-1/3 flex items-center justify-center font-semibol cursor-pointer text-lg'><AiFillMinusCircle onClick={()=>{removefromCart(k, 1, cart[k].price, cart[k].name, cart[k].variant, cart[k].size )}} className='text-sm text-blue-700' /> <span className='mx-2'>{cart[k].qty}</span><FaCirclePlus onClick={()=>{addtoCart(k, 1, cart[k].price, cart[k].name, cart[k].variant, cart[k].size )}} className='text-sm text-blue-700' /></div>
            </div>
          </li>})}
        
        </ol>
        <span className='font-bold w-1/2 text-center'>Subtotal: ₹{subtotal}</span>
        <div className="flex">

        <Link href={"/checkout"}><button disabled={Object.keys(cart).length === 0} className="flex mr-6 mt-6 text-white disabled:bg-blue-300 bg-blue-700 border-0 py-1 px-4 focus:outline-none hover:bg-blue-600 rounded text-sm"><IoBagCheck className='m-1'/>Checkout</button></Link>
        <button onClick={clearCart} disabled={Object.keys(cart).length === 0} className="flex text-white mt-6 bg-blue-700 disabled:bg-blue-300 border-0  py-1 px-3 focus:outline-none hover:bg-blue-600  rounded text-sm"> Clear Cart</button>
        </div>

      </div>
    </>
  )
}

export default Navbar