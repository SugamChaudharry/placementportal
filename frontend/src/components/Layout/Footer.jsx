import React, { useContext } from 'react'
import { Context } from "../../main"
import { Link } from "react-router-dom"
import { FaGithub, FaLinkedin } from "react-icons/fa"
import { SiLeetcode } from "react-icons/si";
import { RiInstagramFill } from "react-icons/ri"

function Footer() {
  const { isAuthorized } = useContext(Context)

  if (!isAuthorized) return null;

  return (
    <footer className="bg-neutral-50 dark:bg-neutral-900 border-t border-neutral-200 dark:border-neutral-700 mt-16">
      <div className="container-base py-12">
        {/* Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <img 
              src="/careerconnect-white.png" 
              alt="CareerConnect" 
              className="h-10 w-auto dark:invert mb-4"
            />
            <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4">
              Connecting top talent with innovative companies. Find your dream job or hire the best candidates today.
            </p>
            {/* Social Links */}
            <div className="flex items-center space-x-4">
              <SocialLink href="https://github.com/exclusiveabhi" icon={<FaGithub />} label="GitHub" />
              <SocialLink href="https://www.linkedin.com/in/abhishek-rajput-/" icon={<FaLinkedin />} label="LinkedIn" />
              <SocialLink href="https://leetcode.com/u/exclusiveabhi/" icon={<SiLeetcode />} label="LeetCode" />
              <SocialLink href="https://www.instagram.com/exclusiveabhi/" icon={<RiInstagramFill />} label="Instagram" />
            </div>
          </div>

          {/* Product */}
          <div>
            <h4 className="text-sm font-semibold text-neutral-900 dark:text-white mb-4">Product</h4>
            <ul className="space-y-2">
              <FooterLink to="/job/getall" label="Browse Jobs" />
              <FooterLink to="/jobseekers" label="Find Talent" />
              <FooterLink to="/job/post" label="Post a Job" />
              <FooterLink to="/applications/me" label="Applications" />
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-sm font-semibold text-neutral-900 dark:text-white mb-4">Company</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-sm text-neutral-600 dark:text-neutral-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                  About Us
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-neutral-600 dark:text-neutral-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                  Blog
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-neutral-600 dark:text-neutral-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                  Careers
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-neutral-600 dark:text-neutral-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                  Press
                </a>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-sm font-semibold text-neutral-900 dark:text-white mb-4">Legal</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-sm text-neutral-600 dark:text-neutral-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                  Privacy
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-neutral-600 dark:text-neutral-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                  Terms
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-neutral-600 dark:text-neutral-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                  Cookie Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-neutral-600 dark:text-neutral-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                  Contact
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-neutral-200 dark:border-neutral-700 pt-8">
          <p className="text-sm text-center text-neutral-600 dark:text-neutral-400">
            &copy; {new Date().getFullYear()} CareerConnect. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}

// Helper Components
const SocialLink = ({ href, icon, label }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-neutral-200 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-primary-500 dark:hover:bg-primary-600 hover:text-white dark:hover:text-white transition-colors"
    aria-label={label}
  >
    {icon}
  </a>
)

const FooterLink = ({ to, label }) => (
  <li>
    <Link 
      to={to} 
      className="text-sm text-neutral-600 dark:text-neutral-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
    >
      {label}
    </Link>
  </li>
)

export default Footer
