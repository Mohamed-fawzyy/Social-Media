import { useState } from "react";
import "./update.scss"
import { useMutation, useQueryClient } from '@tanstack/react-query'
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { makeRequest } from "../../axios";

const Update = ({ setUpdateOpen, userData }) => {

    const queryClient = useQueryClient();

    const [cover, setCover] = useState("")
    const [profile, setProfile] = useState("")
    const [text, setText] = useState({
        name: userData.name,
        city: userData.city,
        website: userData.website
    });

    const handleChange = (e) => {
        setText((prevData) => ({ ...prevData, [e.target.name]: [e.target.value] }))
    }

    const upload = async (file) => {
        try {
            const formData = new FormData();
            formData.append("file", file);
            const res = await makeRequest.post("/upload", formData)
            return res.data;
        } catch (error) {
            console.log(error)
        }
    }

    const mutation = useMutation({
        mutationFn: (userInfo) => {
            return makeRequest.put('/users', userInfo)
        },
        onSuccess: () => {
            // Invalidate and refetch(refresh)
            queryClient.invalidateQueries({ queryKey: ['users'] })
        },
    })

    const handleClick = async (e, res) => {
        e.preventDefault()

        try {
            let coverUrl;
            let profileUrl;

            coverUrl = cover ? await upload(cover) : userData.coverPic
            profileUrl = profile ? await upload(profile) : userData.profilePic

            mutation.mutate({ ...text, profilePic: profileUrl, coverPic: coverUrl })
            setUpdateOpen(false)
            setCover(null);
            setProfile(null);
        } catch (error) {
            res.status(500).json("Error in Updating the user data : " + error)
        }
    }

    // return (
    //     <div className="update">
    //         <form>
    //             <input type="file" onChange={e => setProfile(e.target.files[0])} />
    //             <input type="file" onChange={e => setCover(e.target.files[0])} />
    //             <input type="text" name="name" onChange={handleChange} />
    //             <input type="text" name="city" onChange={handleChange} />
    //             <input type="text" name="website" onChange={handleChange} />
    //             <button onClick={handleClick}>update</button>
    //         </form>
    //         <button onClick={() => setUpdateOpen(false)}>X</button>
    //     </div>
    // )
    return (
        <div className="update">
            <div className="wrapper">
                <h1>Update Your Profile</h1>
                <form>
                    <div className="files">
                        <label htmlFor="cover">
                            <span>Cover Picture</span>
                            <div className="imgContainer">
                                <img
                                    src={
                                        cover
                                            ? URL.createObjectURL(cover)
                                            : "../upload/" + userData.coverPic
                                    }
                                    alt=""
                                />
                                <CloudUploadIcon className="icon" />
                            </div>
                        </label>
                        <input
                            type="file"
                            id="cover"
                            style={{ display: "none" }}
                            onChange={(e) => setCover(e.target.files[0])}
                        />
                        <label htmlFor="profile">
                            <span>Profile Picture</span>
                            <div className="imgContainer">
                                <img
                                    src={
                                        profile
                                            ? URL.createObjectURL(profile)
                                            : "../upload/" + userData.profilePic
                                    }
                                    alt=""
                                />
                                <CloudUploadIcon className="icon" />
                            </div>
                        </label>
                        <input
                            type="file"
                            id="profile"
                            style={{ display: "none" }}
                            onChange={(e) => setProfile(e.target.files[0])}
                        />
                    </div>
                    <label>Name</label>
                    <input
                        type="text"
                        value={text.name}
                        name="name"
                        onChange={handleChange}
                    />
                    <label>Country / City</label>
                    <input
                        type="text"
                        name="city"
                        value={text.city}
                        onChange={handleChange}
                    />
                    <label>Website</label>
                    <input
                        type="text"
                        name="website"
                        value={text.website}
                        onChange={handleChange}
                    />
                    <button onClick={handleClick}>Update</button>
                </form>
                <button className="close" onClick={() => setUpdateOpen(false)}>
                    close
                </button>
            </div>
        </div>
    );
};


export default Update;