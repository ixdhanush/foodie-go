import Link from "next/link";
import { Mail, Phone, MapPin } from "lucide-react";
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-white dark:bg-zinc-950 border-t border-gray-200 dark:border-zinc-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <span className="text-2xl font-black bg-gradient-to-r from-orange-500 to-rose-500 bg-clip-text text-transparent">
              FoodieGo
            </span>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-4">
              Delicious food, delivered fast to your door. Experience the best dining right from home.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-orange-500 transition-colors">
                <FaFacebook size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-orange-500 transition-colors">
                <FaTwitter size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-orange-500 transition-colors">
                <FaInstagram size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-orange-500 transition-colors">
                <FaLinkedin size={20} />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-4">
              Explore
            </h3>
            <ul className="space-y-3">
              <li>
                <Link href="/" className="text-sm text-gray-500 dark:text-gray-400 hover:text-orange-500">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/foods" className="text-sm text-gray-500 dark:text-gray-400 hover:text-orange-500">
                  Menu
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-sm text-gray-500 dark:text-gray-400 hover:text-orange-500">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-sm text-gray-500 dark:text-gray-400 hover:text-orange-500">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-4">
              Support
            </h3>
            <ul className="space-y-3">
              <li>
                <Link href="/faq" className="text-sm text-gray-500 dark:text-gray-400 hover:text-orange-500">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-sm text-gray-500 dark:text-gray-400 hover:text-orange-500">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-sm text-gray-500 dark:text-gray-400 hover:text-orange-500">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/track" className="text-sm text-gray-500 dark:text-gray-400 hover:text-orange-500">
                  Track Order
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-4">
              Contact Us
            </h3>
            <ul className="space-y-3">
              <li className="flex items-center space-x-3 text-sm text-gray-500 dark:text-gray-400">
                <MapPin size={16} className="text-orange-500 shrink-0" />
                <span>123 Food Street, Yumville 10101</span>
              </li>
              <li className="flex items-center space-x-3 text-sm text-gray-500 dark:text-gray-400">
                <Phone size={16} className="text-orange-500 shrink-0" />
                <span>+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center space-x-3 text-sm text-gray-500 dark:text-gray-400">
                <Mail size={16} className="text-orange-500 shrink-0" />
                <span>hello@foodiego.com</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-gray-200 dark:border-zinc-800 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500 dark:text-gray-400">
          <p>&copy; {new Date().getFullYear()} FoodieGo. All rights reserved.</p>
          <div className="mt-4 md:mt-0 flex space-x-4">
            <span>Made with <span className="text-red-500">♥</span> for food lovers</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
