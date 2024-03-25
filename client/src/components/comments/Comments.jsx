import "./comments.scss";
import moment from "moment"
import { useState } from "react";
import { useContext } from "react";
import { AuthContext } from "../../context/authContext";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { makeRequest } from "../../axios";

const Comments = (postId) => {
  const queryClient = useQueryClient();
  const { currentUser } = useContext(AuthContext);
  const [desc, setDesc] = useState("")

  const { isLoading, error, data } = useQuery({
    queryKey: ["comments", postId['postId']],
    queryFn: () => makeRequest.get("/comments?postId=" + postId['postId']).then((res) => {
      return res.data;
    })
  }
  );

  const mutation = useMutation({
    mutationFn: (newComment) => {
      return makeRequest.post('/comments', newComment)
    },
    onSuccess: () => {
      // Invalidate and refetch(refresh)
      queryClient.invalidateQueries({ queryKey: ['comments'] })
    },
  })

  const handleClick = async (e, res) => {
    e.preventDefault()

    try {
      mutation.mutate({ desc, postId:postId['postId'] })
      setDesc("")

    } catch (error) {
      res.status(500).json("Error in Fetching the comments : " + error)
    }
  }

  return (
    <div className="comments">
      <div className="write">
        <img src={currentUser.profilePic} alt="" />
        <input type="text" placeholder="write a comment" value={desc} onChange={e => { setDesc(e.target.value) }}
        />
        <button onClick={handleClick}>Send</button>
      </div>
      {error ? "Something went wrong in loading comments!"
        : (isLoading ? "Loading comments..." : data.map((comment) => (
          <div className="comment" key={comment.id}>
            <img src={comment.profilePic} alt="" />
            <div className="info">
              <span>{comment.name}</span>
              <p>{comment.desc}</p>
            </div>
            <span className="date">{moment(comment.createdAt).fromNow()}</span>
          </div>
        )))}
    </div>
  );
};

export default Comments;
