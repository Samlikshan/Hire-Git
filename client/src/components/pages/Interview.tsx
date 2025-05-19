import { useEffect, useRef, useState } from "react";
import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "@/reducers/rootReducer";
import { useNavigate } from "react-router-dom";
import { validateRoomAccessService } from "@/services/interview";
import axios from "axios";

// interface VideoConferenceProps {
//   onLeave?: () => void;
// }

interface RoomUser {
  userID: string;
  userName: string;
}

const VideoConference = () => {
  const { userData, role } = useSelector((state: RootState) => state.user);
  const containerRef = useRef<HTMLDivElement>(null);
  const zegoRef = useRef(null);
  const [isRoomEmpty, setIsRoomEmpty] = useState(false);
  const roomEmptyRef = useRef(false);
  // const [hasSummaryBeenSent, setHasSummaryBeenSent] = useState(false);
  const [participants, setParticipants] = useState<RoomUser[]>([]);
  // const [isLastUserToLeave, setIsLastUserToLeave] = useState(false);
  const roomID = useParams().roomId;
  const navigate = useNavigate();

  useEffect(() => {
    const validateRoomAccess = async () => {
      if (!roomID) {
        return;
      }
      if (!userData || !userData._id || !userData.name) {
        console.error("User ID and User Name are required for ZegoCloud!");
        navigate("/login");
        return;
      }
      try {
        const response = await validateRoomAccessService(roomID);
        if (response.status == 400) {
          navigate("/dashbaord");
          return;
        }
      } catch (error) {
        if (axios.isAxiosError(error) && error.response?.status === 400) {
          navigate("/");
        } else {
          console.error(
            "Unexpected error during room access validation",
            error
          );
        }
      }
    };
    validateRoomAccess();
    const initializeZego = async () => {
      const appID = Number(import.meta.env.VITE_ZEGO_APP_ID);
      const serverSecret = import.meta.env.VITE_ZEGO_SERVER_SECRET;

      if (!roomID || roomID.trim() === "") {
        console.error("Room ID is empty or undefined!");
        navigate("/login");
        return;
      }

      if (!userData || !userData._id || !userData.name) {
        console.error("User ID and User Name are required for ZegoCloud!");
        navigate("/login");
        return;
      }

      try {
        const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
          Number(appID),
          serverSecret,
          roomID,
          userData._id,
          userData.name
        );

        const zp = ZegoUIKitPrebuilt.create(kitToken);
        zegoRef.current = zp;

        if (!zp) {
          console.error("Failed to create ZegoUIKitPrebuilt instance");
          return;
        }

        zp.joinRoom({
          container: containerRef.current!,
          scenario: {
            mode: ZegoUIKitPrebuilt.VideoConference,
          },
          showPreJoinView: true,
          showScreenSharingButton: true,
          showUserList: true,
          showLayoutButton: true,
          showPinButton: true,
          turnOnMicrophoneWhenJoining: true,
          turnOnCameraWhenJoining: true,
          showMyCameraToggleButton: true,
          showMyMicrophoneToggleButton: true,
          showAudioVideoSettingsButton: true,
          showTextChat: true,
          showRoomDetailsButton: true,
          maxUsers: 50,
          layout: "Auto",
          showLeavingView: true,
          onUserJoin: (users) => {
          },

          // Modify your onUserLeave handler
          onUserLeave: (users) => {
            const leftUserIds = users.map((u) => u.userID);

            setParticipants((prev) => {
              const remaining = prev.filter(
                (p) => !leftUserIds.includes(p.userID)
              );
              const isEmpty = remaining.length === 0;

              // Update both state and ref
              setIsRoomEmpty(isEmpty);
              roomEmptyRef.current = isEmpty;

              return remaining;
            });
          },

          onLeaveRoom: async () => {
            if (role === "company") {
              // Navigate to evaluation page with room ID
              navigate("/company/evaluation", { state: { roomID } });
              return;
            } else {
              // Go back normally
              navigate(-1);
              return;
            }
          },

          showNonVideoUser: true,
          showOnlyAudioUser: true,
          useFrontFacingCamera: true,
          whiteboardConfig: {
            showAddImageButton: true,
            showCreateAndCloseButton: true,
          },
          branding: {
            logoURL:
              "https://myhirebucket.s3.us-east-1.amazonaws.com/profile/ChatGPT+Image+May+9%2C+2025%2C+10_19_11+AM.png",
          },
        });
      } catch (error) {
        console.error("ZegoCloud initialization error:", error);
      }
    };

    if (containerRef.current) {
      initializeZego();
    }

    return () => {
      // Cleanup
      if (zegoRef.current) {
      }
    };
  }, [roomID, userData]);

  return (
    <div className="w-full h-full">
      <div ref={containerRef} className="w-full h-full" />
    </div>
  );
};

export default VideoConference;
