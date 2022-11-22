
import {useState, useEffect} from 'react';
import SideNavigationBar from "../components/SideNavigationBar/SideNavigationBar";
import { BiArrowBack } from "react-icons/bi";
import { useNavigate , useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Spinner from "../components/Spinner";
import { NewComment, Comments, LikesModal ,EditPost } from "../components/PostInfoPageComponents/index";
import {
  fetchSinglePost,
  deletePost,
  fetchPostComments, } from "../features/post/postSlice";
import dayjs from "dayjs";


export const PostInfo = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {postId} = useParams();
  const { post, loading, errMessage } = useSelector((state) => state.post);
  const likesCount = post?.likes?.length;
  const commentCount = post?.comments?.length;
  const createdAt =
  post !== null ? dayjs(post?.createdAt).format("h:mm A - MMM D, YYYY") : "";
  const user = useSelector((state) => state.user.data);
  const [showModal, setShowModal] = useState(false);
  const [showEditPost, setShowEditPost] = useState(false);
  const isPostOwnedByUser = user._id === post?.author;
 


  const deleteHandler = () => {
    dispatch(deletePost({postId:post._id}))
  }

  useEffect(() => {
  dispatch(fetchSinglePost({ postId }));
  dispatch(fetchPostComments({ postId }));
}, []);


  return (
    <>
      <div className="flex h-screen bg-white z-10">
        <SideNavigationBar />
        <div className="w-600 border">
          <div className="fixed w-600 h-10 bg-white flex items-center p-2 border space-x-6">
            <i aria-label="Back" role="button">
              <BiArrowBack className="inline" onClick={() => navigate(-1)} />
            </i>
            <span className="font-semibold" role="heading">
              Post
            </span>
          </div>
          <div className="mt-10 w-full">
            {errMessage && (
              <div className="text-center font-medium mt-16">{errMessage}</div>
            )}
            {loading ? (
              <div className="flex justify-center mt-16">
                <Spinner />
              </div>
            ) : (
              <div className="mt-10 w-full border">
                <div className="p-2 flex">
                  <div className="w-10 h-10 rounded-full bg-gray-200"></div>
                  <div className="ml-2 w-full">
                    <div className="leading-tight">
                      <span className="font-semibold">{post?.authorName}</span>
                      {isPostOwnedByUser && (
                        <span className="text-gray-400 text-sm float-right">
                          <button
                            className="small-button"
                            onClick={() => setShowEditPost(true)}
                          >
                            Edit
                          </button>
                          <button
                            onClick={deleteHandler}
                            className="small-button"
                          >
                            Delete
                          </button>
                        </span>
                      )}
                    </div>
                    <span className="text-gray-400">{`@${post?.authorUsername}`}</span>
                    {showEditPost ? (
                      <EditPost post={post} setShowEditPost={setShowEditPost} />
                    ) : (
                      <div className="py-5 text-lg">{post?.content}</div>
                    )}
                    <div className="text-sm text-gray-400">
                      {createdAt ?? ""}
                    </div>
                  </div>
                </div>
                <div className="border-t-2 border-b-2 border-gray-100 m-4 py-2 space-x-5">
                  <span
                    className="cursor-pointer font-semibold"
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowModal(true);
                    }}
                  >
                    {likesCount}
                    <span className="text-gray-400 ml-1 font-normal">
                      {likesCount === 1 ? "Like" : "Likes"}
                    </span>
                  </span>
                  <span className="font-semibold">
                    {commentCount}
                    <span className="text-gray-400 ml-1 font-normal">
                      {commentCount === 1 ? "Comment" : "Comments"}
                    </span>
                  </span>
                </div>
              </div>
            )}
            <NewComment userId={user?._id} postId={post?._id} />
            <Comments />
          </div>
        </div>
      </div>
      {showModal && <LikesModal postId={postId} setShowModal={setShowModal} />}
    </>
  )
}

export default PostInfo