import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import Layout from './layout';
import Notes from './Notes/Notes';
import Events from './Events/Events';
import Contacts from './Contacts/Contacts';
import MySpace from './MySpace/MySpace';
import ViewContact from './Contacts/ViewContact';
import AddContact from './Contacts/AddContact';
import AllContacts from './Contacts/AllContacts';
import EditContact from './Contacts/EditContact';
import AllNotes from './Notes/AllNotes';
import AddNote from './Notes/AddNote';
import ViewNote from './Notes/ViewNote';
import LogIn from './Auth/LogIn';
import SignUp from './Auth/SignUp';
import AddPost from './MySpace/AddPost';
import UserDetails from './MySpace/UserDetails';
import UserPosts from './MySpace/UserPosts';

function App() {

  const ProtectedRoute = ({ children }) => {
    const token = localStorage.getItem('token');
    const navigate = useNavigate();

    useEffect(() => {
      if (token) {
        try {
          const decodedToken = jwtDecode(token);
          if (decodedToken.exp * 1000 < Date.now()) {
            localStorage.removeItem('token');
            navigate('/login');
          }
        } catch (error) {
          localStorage.removeItem('token');
          navigate('/login');
        }
      } else {
        navigate('/login');
      }
    }, [token, navigate]);

    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        if (decodedToken.exp * 1000 > Date.now()) {
          return children;
        }
      } catch (error) {
        return <Navigate to="/login" replace />;
      }
    }

    return null;
  };

  const AuthRoute = ({ children }) => {
    const token = localStorage.getItem('token');
    const navigate = useNavigate();

    useEffect(() => {
      if (token) {
        try {
          const decodedToken = jwtDecode(token);
          console.log(decodedToken)
          if (decodedToken.exp * 1000 > Date.now()) {
            navigate('/');
          }
        } catch (error) {}
      }
    }, [token, navigate]);

    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        if (decodedToken.exp * 1000 > Date.now()) {
          return <Navigate to="/" replace />;
        }
      } catch (error) {}
    }
    return children;
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<AuthRoute><LogIn /></AuthRoute>} />
        <Route path="/signup" element={<AuthRoute><SignUp /></AuthRoute>} />
        <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
          <Route index element={<MySpace />} />
          <Route path="notes" element={<Notes />}>
            <Route index element={<AllNotes />} />
            <Route path="view/:id" element={<ViewNote />} />
            <Route path="add" element={<AddNote />} />
          </Route>
          <Route path="events" element={<Events />} />
          <Route path="contacts" element={<Contacts />}>
            <Route index element={<AllContacts />} />
            <Route path="view/:id" element={<ViewContact />} />
            <Route path="add" element={<AddContact />} />
            <Route path="edit/:id" element={<EditContact />} />
          </Route>
          <Route path="/post/add" element={<AddPost />} />
          <Route path="/user/details" element={<UserDetails />} />
          
          <Route path="/post/:postId" element={<UserPosts />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;