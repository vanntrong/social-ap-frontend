import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import CloseIcon from '@mui/icons-material/Close';
import EmojiEmotionsOutlinedIcon from '@mui/icons-material/EmojiEmotionsOutlined';
import Avatar from '@mui/material/Avatar';
import { createPostApi } from 'api/postApi';
import DragImage from 'components/dragImage/DragImage';
import ProgressLoading from 'components/loadings/progressLoading/ProgressLoading';
import ModalSelectAudience from 'components/modal/modalSelectAudience/ModalSelectAudience';
import { AudiencePostIcon } from 'components/post/Post';
import { Picker } from 'emoji-mart';
import 'emoji-mart/css/emoji-mart.css';
import useSearchUser from 'hooks/useSearchUser';
import React, { FC, useState } from 'react';
import { AiOutlineClose, AiOutlineSearch } from 'react-icons/ai';
import { BsFillCaretDownFill } from 'react-icons/bs';
import { FaUserPlus } from 'react-icons/fa';
import { IoArrowBackOutline } from 'react-icons/io5';
import { toast } from 'react-toastify';
import { formPostData, PostType } from 'shared/types';
import { useAppSelector } from 'store/hooks';
import { selectTheme } from 'store/slice/themeSlice';
import { selectCurrentUser } from 'store/slice/userSlice';
import { convertFileSize } from 'utils/upload';
import '../inputpost.scss';

interface SearchPeopleToTagProps {
  type: 'add' | 'tag';
  onClose: () => void;
  setTagsPeople: React.Dispatch<React.SetStateAction<string[]>>;
  tagsPeople: string[];
  handleAdd?: () => void;
}

interface tagPeoplePreview {
  name: string;
  id: string;
  avatar: string;
}

export const SearchPeopleToTag: FC<SearchPeopleToTagProps> = ({
  type,
  onClose,
  setTagsPeople,
  tagsPeople,
  handleAdd,
}) => {
  const [searchText, setSearchText] = useState('');
  const [tagsPeoplePreview, setTagsPeoplePreview] = useState<tagPeoplePreview[]>([]);
  const isDarkMode = useAppSelector(selectTheme);

  const { searchResult, setSearchResult } = useSearchUser(searchText);

  const currentUser = useAppSelector(selectCurrentUser);

  const handleClickResult = (user: any) => {
    if (tagsPeoplePreview.includes(user._id)) {
      return;
    }
    setTagsPeoplePreview([
      ...tagsPeoplePreview,
      { id: user._id, name: user.fullName, avatar: user.avatar },
    ]);
    setTagsPeople((prev) => [...prev, user._id]);
    setSearchResult([]);
  };

  const handleClickDelete = (id: string) => {
    setTagsPeoplePreview((prev) => prev.filter((tag) => tag.id !== id));
    setTagsPeople((prev) => prev.filter((tag) => tag !== id));
  };
  return (
    <div className={`inputPostSearchPeople ${isDarkMode ? 'dark' : ''}`}>
      <div className="inputPostSearchPeople-top">
        <div onClick={onClose}>
          <Avatar className="inputPostSearchPeople-top-close">
            <IoArrowBackOutline />
          </Avatar>
        </div>
        <h3>{type === 'tag' ? 'Tag people' : 'Add people'}</h3>
      </div>
      <hr />
      <div className="inputPostSearchPeople-center">
        <div className="inputPostSearchPeople-input">
          <AiOutlineSearch />
          <input
            type="text"
            placeholder="Search for friends"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
        </div>
        <button className="inputPostSearchPeople-button" onClick={onClose}>
          Done
        </button>
      </div>
      <div className="inputSearchPeopleResults">
        {tagsPeoplePreview.length > 0 && (
          <div className="tagPeople-list">
            {tagsPeoplePreview.map((item, index) => (
              <div className="tagPeople-item" key={index}>
                <div className="tagPeople-item-avatar">
                  <Avatar src={item.avatar} />
                  <button onClick={() => handleClickDelete(item.id)}>
                    <AiOutlineClose />
                  </button>
                </div>
                <h4>{item.name}</h4>
              </div>
            ))}
          </div>
        )}

        {searchResult.length === 0 && <p>No people found</p>}

        {searchResult.length > 0 &&
          searchResult.map(
            (user) =>
              user._id !== currentUser!._id &&
              !tagsPeople.includes(user._id) && (
                <div className="result" onClick={() => handleClickResult(user)} key={user._id}>
                  <div className="result-info">
                    <Avatar src={user.avatar} alt={user.fullName} />
                    <div className="result-info__name">{user.fullName}</div>
                  </div>
                </div>
              )
          )}
      </div>
      {type === 'add' && (
        <button
          className="inputPostSearchPeople-button-add"
          disabled={tagsPeoplePreview.length === 0}
          onClick={() => {
            if (handleAdd) {
              handleAdd();
              onClose();
            }
          }}
        >
          <span>Add People</span>
        </button>
      )}
    </div>
  );
};

interface InputPostModalProps {
  setIsShowPostModal: React.Dispatch<React.SetStateAction<boolean>>;
  setPosts: React.Dispatch<React.SetStateAction<PostType[]>>;
}

const InputPostModal: FC<InputPostModalProps> = ({ setIsShowPostModal, setPosts }) => {
  const [isShowEmojiPicker, setIsShowEmojiPicker] = useState<boolean>(false);
  const [postContent, setPostContent] = useState<string>('');
  const [audience, setAudience] = useState<'public' | 'friends' | 'private'>('public');
  const [isSubmit, setIsSubmit] = useState<boolean>(false);
  const [filesPreview, setFilesPreview] = useState<any[]>([]);
  const [assetsData, setAssetsData] = useState<any[]>([]);
  const [isShowDragAndDrop, setIsShowDragAndDrop] = useState<boolean>(false);
  const [isShowSearchTagPeople, setIsShowSearchTagPeople] = useState<boolean>(false);
  const [isShowModalSelectAudience, setIsShowModalSelectAudience] = useState<boolean>(false);
  const [tagsPeople, setTagsPeople] = useState<string[]>([]);
  const currentUser = useAppSelector(selectCurrentUser);
  const isDarkMode = useAppSelector(selectTheme);

  const selectEmojiHandler = (emoji: any) => {
    setPostContent(postContent + emoji.native);
  };

  const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmit(true);
    const data: formPostData = {
      userPost: currentUser!._id,
      content: postContent,
      tagsPeople,
      audience,
    };
    if (assetsData.length > 0) {
      data.assets = assetsData;
    }
    const timer = setTimeout(() => {
      setIsSubmit(false);
      setIsShowPostModal(false);
    }, 500);
    toast.success('Your post is being on process...', {});
    const res = await createPostApi(data);
    setPosts((prev) => [res, ...prev]);
    setPostContent('');
    return () => {
      clearTimeout(timer);
    };
  };

  const hideButtonClickHandler = () => {
    setIsShowPostModal(false);
    setPostContent('');
  };

  const showDragAndDrop = () => {
    setIsShowDragAndDrop((prev) => !prev);
  };

  const changFilesHandler = (files: any[]) => {
    if (files) {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const fileSize = convertFileSize(file.size);
        const media_type = file.type.split('/')[0];

        if (media_type === 'image' && fileSize > 10) {
          toast.error('Image size must be less than 10MB');
          return;
        }

        if (media_type === 'video' && fileSize > 100) {
          toast.error('Video size must be less than 100MB');
          return;
        }

        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = () => {
          const url = reader.result;
          setAssetsData((prev) => [...prev, { media_type, url }]);
          setFilesPreview((prev) => [...prev, { media_type, url: reader.result }]);
        };
      }
    }
  };

  const handleCloseSearchTagPeople = () => {
    setIsShowSearchTagPeople(false);
  };

  const hanldeCloseSelectAudience = () => {
    setIsShowModalSelectAudience(false);
  };

  return (
    <>
      <form className={`form-post-modal ${isDarkMode ? 'dark' : ''}`} onSubmit={submitHandler}>
        <div className="form-post-title">
          <h2>Create post</h2>
          <div onClick={hideButtonClickHandler} style={{ cursor: 'pointer' }}>
            <Avatar className="form-post-close">
              <CloseIcon />
            </Avatar>
          </div>
        </div>
        <hr />
        <div className="form-post-feature">
          <div className="form-post-user">
            <Avatar src={currentUser?.avatar} alt="" />
            <div className="form-post-user-info">
              <h3>{currentUser?.fullName}</h3>
              <div
                className="form-post-audience"
                onClick={() => setIsShowModalSelectAudience(true)}
              >
                <AudiencePostIcon audience={audience} />
                <p>{audience}</p>
                <BsFillCaretDownFill size={15} />
              </div>
            </div>
          </div>
          <div className="form-post-content">
            <textarea
              rows={5}
              placeholder={`What's on your mind, ${currentUser?.lastName}?`}
              autoFocus
              value={postContent}
              onChange={(e) => setPostContent(e.target.value)}
            ></textarea>
          </div>
          {isShowDragAndDrop && (
            <div className="drag-drop-container">
              <DragImage changFilesHandler={changFilesHandler} filesPreview={filesPreview} />
            </div>
          )}

          <div className="emoji-picker">
            <div
              onClick={() => {
                setIsShowEmojiPicker(!isShowEmojiPicker);
              }}
              style={{ cursor: 'pointer' }}
            >
              <EmojiEmotionsOutlinedIcon htmlColor="#d3d8e0" fontSize="medium" />
            </div>
            {isShowEmojiPicker && (
              <Picker
                onSelect={selectEmojiHandler}
                theme="light"
                set="facebook"
                style={{
                  cursor: 'pointer',
                  position: 'absolute',
                  top: '0',
                  right: '0',
                  transform: 'translateY(-105%)',
                }}
                showPreview={false}
                showSkinTones={false}
              />
            )}
          </div>
          {filesPreview.length > 0 && <div className="assets-preview"></div>}

          <div className="form-post-assets">
            <h4>Add to your post</h4>
            <div className="form-post-assets-item">
              <div style={{ cursor: 'pointer', fontSize: '35px' }}>
                <AddPhotoAlternateIcon
                  htmlColor="#2d6a4f"
                  fontSize="inherit"
                  onClick={() => showDragAndDrop()}
                />
              </div>
              <div style={{ cursor: 'pointer', fontSize: '35px' }}>
                <FaUserPlus
                  color="#05f"
                  fontSize="inherit"
                  onClick={() => setIsShowSearchTagPeople(true)}
                />
              </div>
            </div>
          </div>
          <button type="submit" disabled={postContent.length === 0} className="form-post-submit">
            Post
          </button>
        </div>
      </form>
      {isShowSearchTagPeople && (
        <SearchPeopleToTag
          type="tag"
          onClose={handleCloseSearchTagPeople}
          setTagsPeople={setTagsPeople}
          tagsPeople={tagsPeople}
        />
      )}
      {isShowModalSelectAudience && (
        <ModalSelectAudience
          onClose={hanldeCloseSelectAudience}
          audience={audience}
          setAudience={setAudience}
        />
      )}

      {isSubmit && <ProgressLoading />}
    </>
  );
};
export default InputPostModal;
