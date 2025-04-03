import { useState } from "react";
import {
  Pencil,
  Mail,
  Phone,
  FileText,
  ExternalLink,
  Briefcase,
} from "lucide-react";
import { useSelector } from "react-redux";
import { RootState } from "@/reducers/rootReducer";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import EditProfileModal from "./editProfile";

const ProfileCard = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [openPdf, setOpenPdf] = useState(false);
  const user = useSelector((state: RootState) => state.user.userData);

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden scrollbar-hide">
      {/* Cover Photo */}
      <div className="h-48 bg-[url('https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=1600&q=80')] bg-cover bg-center relative">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/50 to-purple-600/50 backdrop-blur-sm"></div>
        <button
          onClick={() => setIsOpen(true)}
          className="absolute top-4 right-4 bg-white/10 backdrop-blur-sm text-white p-2 rounded-lg hover:bg-white/20 transition-colors"
        >
          <Pencil size={18} />
        </button>
      </div>

      <div className="relative px-6 pb-6">
        {/* Profile Image */}
        <div className="absolute -top-16 left-6">
          <div className="relative group">
            <img
              src={`${import.meta.env.VITE_S3_PATH}/${user?.profileImage}`}
              alt="Profile"
              className="w-32 h-32 rounded-xl border-4 border-white shadow-lg object-cover"
            />
          </div>
        </div>

        {/* Profile Info */}
        <div className="pt-20">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {user?.name || "John Doe"}
              </h1>
              <div className="flex items-center gap-2 mt-1">
                <Briefcase className="w-4 h-4 text-gray-500" />
                <p className="text-lg text-gray-600">
                  {user?.profession || "Software Engineer"}
                </p>
              </div>
            </div>

            {/* Contact Buttons */}
            <div className="flex gap-3">
              <Button variant="outline" className="flex items-center gap-2">
                <Mail size={16} />
                Message
              </Button>
              <Button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700">
                <Phone size={16} />
                Contact
              </Button>
            </div>
          </div>

          {/* Location & Contact Info */}
          <div className="flex items-center gap-6 mt-4 text-gray-600">
            {/* <div className="flex items-center gap-2">
              <Building2 size={16} />
              <span>{user?.company || "Tech Corp"}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin size={16} />
              <span>{user?.location || "San Francisco, CA"}</span>
            </div> */}
            {user?.email && (
              <div className="flex items-center gap-2">
                <Mail size={16} />
                <span>{user.email}</span>
              </div>
            )}
          </div>

          {/* Bio */}
          <p className="mt-4 text-gray-600 leading-relaxed">
            {user?.bio ||
              "Passionate software engineer with expertise in full-stack development, cloud architecture, and building scalable applications. Always eager to learn and tackle new challenges."}
          </p>

          {/* Skills */}
          <div className="mt-6">
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-3">
              Skills & Expertise
            </h3>
            <div className="flex flex-wrap gap-2">
              {(
                user?.skills || [
                  "React",
                  "TypeScript",
                  "Node.js",
                  "AWS",
                  "Docker",
                  "GraphQL",
                ]
              ).map((skill) => (
                <span
                  key={skill}
                  className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium hover:bg-blue-100 transition-colors cursor-default"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Social Links */}
          <div className="mt-6 flex gap-4">
            {user?.socialLinks?.gitHub && (
              <a
                href={user.socialLinks.gitHub}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors group"
              >
                <div className="p-2 rounded-lg bg-gray-100 group-hover:bg-gray-200 transition-colors">
                  <img
                    src="https://cdn-icons-png.flaticon.com/512/25/25231.png"
                    alt="GitHub"
                    className="w-5 h-5"
                  />
                </div>
                <span className="font-medium">GitHub</span>
                <ExternalLink
                  size={14}
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                />
              </a>
            )}
            {user?.socialLinks?.linkedIn && (
              <a
                href={user.socialLinks.linkedIn}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors group"
              >
                <div className="p-2 rounded-lg bg-blue-50 group-hover:bg-blue-100 transition-colors">
                  <img
                    src="https://cdn-icons-png.flaticon.com/512/174/174857.png"
                    alt="LinkedIn"
                    className="w-5 h-5"
                  />
                </div>
                <span className="font-medium">LinkedIn</span>
                <ExternalLink
                  size={14}
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                />
              </a>
            )}
          </div>

          {/* Resume Section */}
          {user?.resume && (
            <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-blue-200 transition-all duration-300">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <FileText className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">
                      Professional Resume
                    </h4>
                    <p className="text-sm text-gray-500">
                      View or download your latest resume
                    </p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  onClick={() => setOpenPdf(true)}
                  className="hover:bg-blue-50"
                >
                  View Resume
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* PDF Viewer Dialog */}
      <Dialog open={openPdf} onOpenChange={setOpenPdf}>
        <DialogContent className="sm:max-w-3xl">
          <DialogHeader>
            <DialogTitle>Resume Preview</DialogTitle>
          </DialogHeader>
          <div className="h-[600px] w-full rounded-md border">
            {user?.resume ? (
              <iframe
                src={`${import.meta.env.VITE_S3_PATH}/${user.resume}`}
                className="w-full h-full"
                title="Resume Preview"
              />
            ) : (
              <p className="text-center text-muted-foreground p-4">
                No resume available.
              </p>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenPdf(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {user && (
        <EditProfileModal isOpen={isOpen} setIsOpen={setIsOpen} user={user} />
      )}
    </div>
  );
};

export default ProfileCard;
