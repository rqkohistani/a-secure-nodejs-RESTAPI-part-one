import fs from 'fs';
import bcrypt from 'bcrypt';
import defaultData from '../../dataBaseJson/default.data.json';

const getAllUsers = () => {
  return defaultData.userData;
};

const getUser = (id) => {
  const user = defaultData.userData.find((user) => user.id === id);
  return user;
};

const getAdminUser = (id) => {
  const user = defaultData.user.find((user) => user.id === id);
  return user;
};

const createUser = (user) => {
  const newUser = {
    id: new Date().getTime(),
    ...user,
    password: bcrypt.hashSync(user.password, 10),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  const data = fs.readFileSync('./dataBaseJson/default.data.json');
  const users = JSON.parse(data);
  fs.writeFileSync(
    './dataBaseJson/default.data.json',
    JSON.stringify({ ...users, userData: [...users.userData, newUser] })
  );
  return newUser;
};

const deleteUser = (id) => {
  const user = defaultData.userData.find((user) => user.id === id);
  if (user) {
    const data = fs.readFileSync('./dataBaseJson/default.data.json');
    const users = JSON.parse(data);
    const newUserData = users.userData.filter((user) => user.id !== id);
    fs.writeFileSync(
      './dataBaseJson/default.data.json',
      JSON.stringify({ user: [...defaultData.user], userData: newUserData })
    );
  }
  return user;
};

// FIXME: It does update the user but it does not return to the user the updated user in postman body response.
// FIXME: if user is not found, it returns {}- in postman body response.
const updateUser = async (id, newUser) => {
  const oldUser = defaultData.userData.find((user) => user.id === id);
  if (oldUser) {
    const data = fs.readFileSync('./dataBaseJson/default.data.json');
    const users = JSON.parse(data);
    const newUserData = users.userData.map((user) => {
      if (user.id === id) {
        return {
          id: user.id,
          ...user,
          ...newUser,
          password: bcrypt.hashSync(user.password, 10),
          updatedAt: new Date().toISOString(),
        };
      }
      return user;
    });
    fs.writeFileSync(
      './dataBaseJson/default.data.json',
      JSON.stringify({ user: [...defaultData.user], userData: newUserData })
    );
    return oldUser;
  }
  return oldUser; // return null if user not found
};

const checkEmail = (email) => {
  const user = defaultData.user.find((user) => user.email === email);
  return user;
};

export const getUserByEmail = (email) => {
  if (checkEmail(email)) {
    return defaultData.user.find((user) => user.email === email);
  }
  return defaultData.userData.find((user) => user.email === email);
};

const userService = {
  getAllUsers,
  getUser,
  createUser,
  deleteUser,
  updateUser,
  getAdminUser,
};

export default userService;
