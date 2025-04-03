import { FaSearch, FaUserCircle, FaHome, FaPaperPlane, FaPlus, FaCog, FaEllipsisV, FaArrowUp, FaRegComment, FaShare } from "react-icons/fa";
import "./Dashboard.css";

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="flex justify-between items-center px-4 py-3 border-b">
        <h1 className="text-lg font-bold">Company Name</h1>
        <div className="flex items-center gap-4">
          <FaSearch className="text-xl" />
          <FaUserCircle className="text-2xl bg-black text-white rounded-full p-1" />
        </div>
      </header>

      {/* Post Section */}
      <div className="p-4">
        {/* User Info */}
        <div className="flex items-center gap-3 mb-3">
          <img
            src="https://via.placeholder.com/40"
            alt="User Avatar"
            className="w-10 h-10 rounded-full"
          />
          <span className="font-bold">CRAZYJGJH</span>
          <FaEllipsisV className="ml-auto text-gray-600" />
        </div>

        {/* Post Image */}
        <div className="w-full h-64 bg-black"></div>

        {/* Post Actions */}
        <div className="flex items-center justify-between mt-3 px-2">
          <div className="flex items-center gap-2">
            <FaArrowUp className="text-xl" />
            <span>1212</span>
          </div>
          <FaRegComment className="text-xl" />
          <FaShare className="text-xl" />
        </div>

        {/* Post Caption */}
        <p className="mt-2 text-sm">
          <span className="font-bold">CRAZYJGJH </span>
          Gbsduysd dbsfs jsdhguis sdishds dsbsgfcedc sdbsd sdgbcfsdfbsk fgf gfg fghhc fdg fgf fgfgh csdcisdcbdscdbkc vkvdfuh vndfvbdfkvkdfvk
        </p>
      </div>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 w-full bg-white p-3 flex justify-around border-t">
        <FaHome className="text-2xl" />
        <FaPaperPlane className="text-2xl" />
        <FaPlus className="text-2xl" />
        <FaCog className="text-2xl" />
      </nav>
    </div>
  );
}
