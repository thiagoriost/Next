import Link from "next/link";
import Image from "next/image";
import { CiLogout } from "react-icons/ci";
import { SidebarItem } from "./SidebarItem";

export const Sidebar = () => {
  return (
    <aside
      className="flex flex-col border-b border-gray-200 bg-yellow-200 px-6 py-6 shadow-sm lg:min-h-screen lg:w-64 lg:border-b-0 lg:border-r lg:shadow-none"
      aria-label="Sidebar"
    >
      <div>
        <div className="py-2">
          {/* TODO: Next/Link hacia dashboard */}
          <Link href="#" title="home">
            {/* Next/Image */}
            {/* <Image
              src="https://tailus.io/sources/blocks/stats-cards/preview/images/logo.svg"
              className="w-32"
              alt="tailus logo"
              width={10}
              height={10}
            /> */}
          </Link>
        </div>

        <div className="mt-8 text-center">
          {/* Next/Image */}
          {/* <Image
            src="https://tailus.io/sources/blocks/stats-cards/preview/images/second_user.webp"
            alt=""
            className="w-10 h-10 m-auto rounded-full object-cover lg:w-28 lg:h-28"
            width={10}
            height={10}
          /> */}
          <h5 className="hidden mt-4 text-xl font-semibold text-gray-600 lg:block">
            Cynthia J. Watts
          </h5>
          <span className="hidden text-gray-400 lg:block">Admin</span>
        </div>

        <ul className="space-y-2 tracking-wide mt-8">
          {/* TODO: src/components <SidebarItem /> */}
          {/* Active className: text-white bg-gradient-to-r from-sky-600 to-cyan-400 */}
          <li>
            <SidebarItem item="Dashboard" />
          </li>
          <li>
            <SidebarItem item="Categories" />
          </li>
        </ul>
      </div>

      <div className="mt-8 flex  border-t border-gray-200 pt-4">
        <button className="px-4 py-3 flex items-center space-x-4 rounded-md text-gray-600 group">
          <CiLogout />
          <span className="group-hover:text-gray-700">Logout</span>
        </button>
      </div>
    </aside>
  );
};
