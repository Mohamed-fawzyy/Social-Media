import "./post.scss";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import FavoriteOutlinedIcon from "@mui/icons-material/FavoriteOutlined";
import TextsmsOutlinedIcon from "@mui/icons-material/TextsmsOutlined";
import ShareOutlinedIcon from "@mui/icons-material/ShareOutlined";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { Link } from "react-router-dom";
import Comments from "../comments/Comments";
import { useContext, useState } from "react";
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { makeRequest } from "../../axios";
import moment from "moment";
import { AuthContext } from "../../context/authContext";

const Post = ({ post }) => {
  const [commentOpen, setCommentOpen] = useState(false);
  const [menuOpen, setmenuOpen] = useState(false);
  const { currentUser } = useContext(AuthContext)
  const queryClient = useQueryClient();

  const { isLoading: cLoading, error: cError, data: commentsLength } = useQuery({
    queryKey: ["comments", post.id],
    queryFn: () => makeRequest.get("/comments?postId=" + post.id).then((res) => {
      return res.data;
    })
  }
  );

  const { isLoading, error, data } = useQuery({
    queryKey: ["likes", post.id], //wizout it it will be static and fixed query for only one post, but we need likes for all posts and this makes it dynamic
    queryFn: () => makeRequest.get("/likes?postId=" + post.id).then((res) => {
      return res.data;
    })
  }
  );

  const mutation = useMutation({
    mutationFn: (liked) => {
      if (liked) return makeRequest.delete('/likes?postId=' + post.id)
      return makeRequest.post('/likes', { postId: post.id })
    },
    onSuccess: () => {
      // Invalidate and refetch(refresh)
      queryClient.invalidateQueries({ queryKey: ["likes"] })
    },
  });

  const handleClick = async (e, res) => {
    e.preventDefault()

    try {
      mutation.mutate(data.includes(currentUser.id))

    } catch (error) {
      res.status(500).json("Error in Fetching the likes : " + error)
    }
  }

  const deleteMutation = useMutation({
    mutationFn: (postId) => {
      return makeRequest.delete('/posts/' + postId)
    },
    onSuccess: () => {
      // Invalidate and refetch(refresh)
      queryClient.invalidateQueries({ queryKey: ["posts"] })
    },
  });

  const handleDelete = async (e, res) => {
    e.preventDefault()

    try {
      deleteMutation.mutate(post.id)

    } catch (error) {
      res.status(500).json("Error in deleting post : " + error)
    }
  }


  return (
    <div className="post">
      <div className="container">
        <div className="user">
          <div className="userInfo">
            <img src={"../upload/" + post.profilePic} alt="" />
            <div className="details">
              <Link
                to={`/profile/${post.userId}`}
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <span className="name">{post.name}</span>
              </Link>
              <span className="date">{moment(post.createdAt).fromNow()}</span>
            </div>
          </div>
          <MoreHorizIcon onClick={() => setmenuOpen(!menuOpen)} />
          {menuOpen && post.userId === currentUser.id && 
          (<button className="close" onClick={handleDelete}>delete</button>)}
        </div>
        <div className="content">
          <p>{post.desc}</p>
          <img src={"./upload/" + post.image} alt="" />
        </div>
        <div className="info">
          <div className="item">
            {isLoading ? "" :
              data && data.includes(currentUser.id) ?
                <FavoriteOutlinedIcon style={{ color: "red" }} onClick={handleClick} /> :
                <FavoriteBorderOutlinedIcon onClick={handleClick} />}
            {data && data.length} Likes
          </div>
          <div className="item" onClick={() => setCommentOpen(!commentOpen)}>
            <TextsmsOutlinedIcon />
            {cLoading ? "Loading" : commentsLength && commentsLength.length} Comments
          </div>
          <div className="item">
            <ShareOutlinedIcon />
            Share
          </div>
        </div>
        {commentOpen && <Comments postId={post.id} />}
      </div>
    </div>
  );
};

export default Post;
