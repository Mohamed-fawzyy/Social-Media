import "./profile.scss";
import FacebookTwoToneIcon from "@mui/icons-material/FacebookTwoTone";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import InstagramIcon from "@mui/icons-material/Instagram";
import PinterestIcon from "@mui/icons-material/Pinterest";
import TwitterIcon from "@mui/icons-material/Twitter";
import PlaceIcon from "@mui/icons-material/Place";
import LanguageIcon from "@mui/icons-material/Language";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Posts from "../../components/posts/Posts"
import { useLocation } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useContext, useState } from "react";
import { makeRequest } from "../../axios";
import { AuthContext } from "../../context/authContext";
import Update from "../../components/update/Update"

const Profile = () => {

  const [updateOpen, setUpdateOpen] = useState(false)
  const userId = parseInt(useLocation().pathname.split('/')[2])
  const { currentUser } = useContext(AuthContext)
  const queryClient = useQueryClient();

  const { isLoading, error, data } = useQuery({
    queryKey: ["users"],
    queryFn: () => makeRequest.get("/users/find/" + userId).then((res) => {
      return res.data;
    })
  }
  );

  const { isLoading: rIsLoading, error: rError, data: relationshipData } = useQuery({
    queryKey: ["relationships"],
    queryFn: () => makeRequest.get("/relationships?followedUserId=" + userId).then((res) => {
      return res.data;
    })
  }
  );

  const mutation = useMutation({
    mutationFn: (following) => {
      if (following) return makeRequest.delete('/relationships?userId=' + userId)
      return makeRequest.post('/relationships', { userId })
    },
    onSuccess: () => {
      // Invalidate and refetch(refresh)
      queryClient.invalidateQueries({ queryKey: ["relationships"] })
    },
  });

  const handleFollow = async (e, res) => {
    e.preventDefault()

    try {
      mutation.mutate(relationshipData.includes(currentUser.id))

    } catch (error) {
      res.status(500).json("Error in Fetching the Relation : " + error)
    }
  }

  return (
    <div className="profile">
      {isLoading ? "Loading data" : data && <>
        <div className="images">
          <img
            src={"../upload/" + data.coverPic}
            alt=""
            className="cover"
          />
          <img
            src={"../upload/" + data.profilePic}
            alt=""
            className="profilePic"
          />
        </div>
        <div className="profileContainer">
          <div className="uInfo">
            <div className="left">
              <a href="http://facebook.com">
                <FacebookTwoToneIcon fontSize="large" />
              </a>
              <a href="http://facebook.com">
                <InstagramIcon fontSize="large" />
              </a>
              <a href="http://facebook.com">
                <TwitterIcon fontSize="large" />
              </a>
              <a href="http://facebook.com">
                <LinkedInIcon fontSize="large" />
              </a>
              <a href="http://facebook.com">
                <PinterestIcon fontSize="large" />
              </a>
            </div>
            <div className="center">
              <span>{data.name}</span>
              <div className="info">
                <div className="item">
                  <PlaceIcon />
                  <span>{data.city}</span>
                </div>
                <div className="item">
                  <LanguageIcon />
                  <span>{data.website}</span>
                </div>
              </div>
              {rIsLoading ? "Loading Data" : userId === currentUser.id ?
                <button onClick={() => setUpdateOpen(true)}>update</button> :
                <button onClick={handleFollow}>{relationshipData.includes(currentUser.id) ?
                  "Following" : "Follow"}</button>}

            </div>
            <div className="right">
              <EmailOutlinedIcon />
              <MoreVertIcon />
            </div>
          </div>
          <Posts userId={userId} />
        </div></>}
      {updateOpen && <Update setUpdateOpen={setUpdateOpen} userData={data} />}
    </div>

  );
};

export default Profile;
