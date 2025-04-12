import { Dialog } from "@headlessui/react";
import { useState } from "react";
import { updateProfileService } from "@/services/candidate";
import { toast } from "sonner";
import { useDispatch } from "react-redux";
import { updateUserData } from "@/reducers/userSlice";
import { Loader2 } from "lucide-react";

interface EditProfileModalProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  user: {
    _id: string;
    name: string;
    profession: string;
    bio: string;
    profileImage: string;
    skills: string[];
    resume: string;
    socialLinks?: {
      github?: string;
      linkedin?: string;
    };
    image?: string; // Add image field
  };
}

const EditProfileModal: React.FC<EditProfileModalProps> = ({
  isOpen,
  setIsOpen,
  user,
}) => {
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    name: user.name,
    profession: user.profession,
    bio: user.bio,
    skills: user.skills.join(", "),
    resume: user.resume,
    github: user?.socialLinks?.github || "",
    linkedin: user?.socialLinks?.linkedin || "",
    image: user.profileImage || "",
  });

  const [previewImage, setPreviewImage] = useState<string | null>(
    user.image || null
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleResumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFormData({ ...formData, resume: file.name });
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
        setFormData({ ...formData, image: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    // Validation checks
    if (!formData.name?.trim()) {
      toast.error("Name is required");
      setIsSubmitting(false);
      return;
    }
    if (!formData.profession?.trim()) {
      toast.error("Profession is required");
      setIsSubmitting(false);
      return;
    }
    const skills = formData.skills.split(",").map((skill) => skill.trim());
    if (skills.length === 0) {
      toast.error("At least one skill is required");
      setIsSubmitting(false);
      return;
    }

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("id", user._id);
      formDataToSend.append("name", formData.name);
      formDataToSend.append(
        "profession",
        formData.profession ? formData.profession : ""
      );
      formDataToSend.append("bio", formData.bio ? formData.bio : "");
      formDataToSend.append("skills", JSON.stringify(skills));
      formDataToSend.append("github", formData.github);
      formDataToSend.append("linkedin", formData.linkedin);

      // Handle profile image
      if (formData.image.startsWith("data:")) {
        // New image selected, convert to blob
        const imageBlob = await fetch(formData.image).then((res) => res.blob());
        formDataToSend.append("profileImage", imageBlob, "profile-image.jpg");
      } else {
        // No new image, send existing image name
        formDataToSend.append("profileImage", formData.image);
      }

      // Handle resume
      const resumeInput = document.querySelector(
        'input[name="resume"]'
      ) as HTMLInputElement;
      const resumeFile = resumeInput?.files?.[0];
      if (resumeFile) {
        formDataToSend.append("resume", resumeFile);
      } else {
        // No new resume, send existing resume name
        formDataToSend.append("resume", formData.resume);
      }

      const response = await updateProfileService(formDataToSend);

      if (response.status == 200) {
        dispatch(
          updateUserData({
            name: formData.name,
            profession: formData.profession,
            bio: formData.bio,
            skills: skills,
            resume: response?.data?.resume,
            socialLinks: {
              linkedIn: formData.linkedin,
              gitHub: formData.github,
            },
            profileImage: response.data?.image || user.profileImage,
          })
        );
        toast.success("Profile Updated Successfully");
      }
      setIsOpen(false);
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog
      open={isOpen}
      onClose={() => setIsOpen(false)}
      className="relative z-50"
    >
      <div className="fixed inset-0 bg-black/30 flex items-center justify-center p-4">
        <Dialog.Panel className="bg-white p-6 rounded-lg w-full max-w-md shadow-lg max-h-[90vh] overflow-y-auto scrollbar-hide">
          <Dialog.Title className="text-lg font-semibold mb-4">
            Edit Profile
          </Dialog.Title>

          <div className="flex flex-col gap-3">
            {/* Image Upload */}
            <label className="text-sm font-medium">Profile Image</label>
            <div className="flex items-center gap-4">
              {previewImage && (
                <img
                  src={previewImage}
                  alt="Profile Preview"
                  className="w-16 h-16 rounded-full object-cover"
                />
              )}
              <input
                type="file"
                name="image"
                accept="image/*"
                onChange={handleImageChange}
                className="border p-2 rounded-md w-full"
              />
            </div>

            <label className="text-sm font-medium">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="border p-2 rounded-md w-full"
            />

            <label className="text-sm font-medium">Profession</label>
            <input
              type="text"
              name="profession"
              value={formData.profession}
              onChange={handleChange}
              className="border p-2 rounded-md w-full"
            />

            <label className="text-sm font-medium">Bio</label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              className="border p-2 rounded-md w-full"
              rows={4}
            />

            <label className="text-sm font-medium">Skills</label>
            <input
              type="text"
              name="skills"
              value={formData.skills}
              onChange={handleChange}
              className="border p-2 rounded-md w-full"
              placeholder="Enter skills separated by commas"
            />

            <label className="text-sm font-medium">Resume</label>
            <div className="flex items-center gap-2">
              <input
                type="file"
                name="resume"
                onChange={handleResumeChange}
                className="border p-2 rounded-md w-full"
              />
              {formData.resume && (
                <span className="text-sm">{formData.resume}</span>
              )}
            </div>

            <label className="text-sm font-medium">GitHub</label>
            <input
              type="text"
              name="github"
              value={formData.github}
              onChange={handleChange}
              className="border p-2 rounded-md w-full"
              placeholder="Enter GitHub profile URL"
            />

            <label className="text-sm font-medium">LinkedIn</label>
            <input
              type="text"
              name="linkedin"
              value={formData.linkedin}
              onChange={handleChange}
              className="border p-2 rounded-md w-full"
              placeholder="Enter LinkedIn profile URL"
            />
          </div>

          <div className="flex justify-end gap-2 mt-4">
            <button
              className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300"
              onClick={() => setIsOpen(false)}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              onClick={() => handleSubmit()}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Saving...
                </div>
              ) : (
                "Save"
              )}
            </button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default EditProfileModal;
