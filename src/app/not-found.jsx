'use client';
import Image from 'next/image';
import Link from 'next/link';
import { Poppins } from 'next/font/google';


// Load the Poppins font
const poppins = Poppins({
  weight: ['400', '600'],
  subsets: ['latin'],
  display: 'swap',
});

export default function NotFound() {
  return (
    <div className={`notfound ${poppins.className}`}>
        <div>
          <Image 
            src="/images/notFound.svg"
            alt="404 Page Not Found"
            className='imgnotfound'
            priority
            width={100}
            height={350}
          />
          <h1 className="textNoFound">SORRY, PAGE NOT FOUND</h1>
          <p className="notAvailable">The page you are looking for is not available</p>
          <Link href={`/`}>
            <button className="not-button">
              Back to home
            </button>
          </Link>
        </div>
    </div>
  );
}
