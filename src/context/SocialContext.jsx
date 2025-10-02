import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const SocialContext = createContext();

export function useSocial() {
  return useContext(SocialContext);
}

export function SocialProvider({ children }) {
  const { user } = useAuth();
  const [publicLists, setPublicLists] = useState([]);
  const [followedUsers, setFollowedUsers] = useState([]);

  // Crear lista pública
  const createPublicList = (listName, products, isPublic = true) => {
    if (!user) return null;

    const newList = {
      id: Date.now(),
      userId: user.id,
      userName: user.name,
      listName,
      products,
      isPublic,
      createdAt: new Date().toISOString(),
      likes: 0,
      shares: 0
    };

    setPublicLists(prev => [newList, ...prev]);
    
    // Guardar en localStorage
    const userLists = JSON.parse(localStorage.getItem(`publicLists_${user.id}`) || '[]');
    localStorage.setItem(`publicLists_${user.id}`, JSON.stringify([newList, ...userLists]));

    return newList;
  };

  // Seguir usuario
  const followUser = (userId) => {
    if (!user) return;

    setFollowedUsers(prev => [...prev, userId]);
    const follows = JSON.parse(localStorage.getItem(`follows_${user.id}`) || '[]');
    localStorage.setItem(`follows_${user.id}`, JSON.stringify([...follows, userId]));
  };

  // Dejar de seguir usuario
  const unfollowUser = (userId) => {
    if (!user) return;

    setFollowedUsers(prev => prev.filter(id => id !== userId));
    const follows = JSON.parse(localStorage.getItem(`follows_${user.id}`) || '[]');
    localStorage.setItem(`follows_${user.id}`, JSON.stringify(follows.filter(id => id !== userId)));
  };

  // Obtener listas públicas de usuarios seguidos
  const getFollowedLists = () => {
    return publicLists.filter(list => 
      followedUsers.includes(list.userId) || list.userId === user?.id
    );
  };

  // Dar like a lista
  const likeList = (listId) => {
    setPublicLists(prev => 
      prev.map(list => 
        list.id === listId ? { ...list, likes: list.likes + 1 } : list
      )
    );
  };

  useEffect(() => {
    if (user) {
      // Cargar listas públicas del usuario
      const userLists = JSON.parse(localStorage.getItem(`publicLists_${user.id}`) || '[]');
      setPublicLists(userLists);

      // Cargar usuarios seguidos
      const follows = JSON.parse(localStorage.getItem(`follows_${user.id}`) || '[]');
      setFollowedUsers(follows);
    }
  }, [user]);

  const value = {
    publicLists,
    followedUsers,
    createPublicList,
    followUser,
    unfollowUser,
    getFollowedLists,
    likeList
  };

  return (
    <SocialContext.Provider value={value}>
      {children}
    </SocialContext.Provider>
  );
}