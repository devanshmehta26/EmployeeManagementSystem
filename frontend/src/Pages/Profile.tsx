import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import {
  Box,
  Typography,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stack,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from '../Store/Store';
import { setUser, clearUser } from '../Slice/AuthSlice';

const Profile: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const user = useSelector((state: RootState) => state.auth.user);

  const [formData, setFormData] = useState({
    name: user?.name || '',
    designation: user?.designation || '',
    salary: user?.salary.toString() || '',
    password: '',
  });
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        designation: user.designation,
        salary: user.salary.toString(),
        password: '',
      });
    }
  }, [user]);

  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSaveEdit = async () => {
    if (!formData.name.trim()) return toast.error('Please enter your name.');
    if (!formData.designation.trim()) return toast.error('Please enter your designation.');
    if (!formData.salary || isNaN(Number(formData.salary)) || Number(formData.salary) <= 0) {
      return toast.error('Salary must be a positive number.');
    }

    try {
      const updated = {
        name: formData.name,
        designation: formData.designation,
        salary: Number(formData.salary),
        ...(formData.password ? { password: formData.password } : {}),
      };

      const response = await axios.put(
        'http://localhost:4000/api/employees/updateUser',
        updated,
        { withCredentials: true }
      );

      dispatch(setUser(response.data.employee));
      setShowEditModal(false);
      toast.success('Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete('http://localhost:4000/api/employees/deleteUser', {
        withCredentials: true,
      });
      dispatch(clearUser());
      toast.success('User deleted');
      setShowDeleteModal(false);
      navigate('/login');
    } catch (error) {
      console.error('Error deleting profile:', error);
      toast.error('Failed to delete user');
    }
  };

  const closeModal = () => {
    setShowEditModal(false);
    setShowDeleteModal(false);
    if (user) {
      setFormData({
        name: user.name,
        designation: user.designation,
        salary: user.salary.toString(),
        password: '',
      });
    }
  };

  if (!user) {
    return (
      <Box
        sx={{
          height: '80vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          bgcolor: '#f5f5f5',
          p: 3,
          textAlign: 'center',
          color: 'text.secondary',
        }}
      >
        <Typography variant="h6">No user data found.</Typography>
      </Box>
    );
  }

  return (
    <>
      <ToastContainer />
      <Box
        sx={{
          minHeight: '80vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          bgcolor: '#f9fafb',
          p: 3,
        }}
      >
        <Box
          sx={{
            bgcolor: 'white',
            p: 4,
            borderRadius: 2,
            boxShadow: 3,
            width: '100%',
            maxWidth: 450,
            textAlign: 'center',
          }}
        >
          <Typography
            variant="h4"
            fontWeight="bold"
            color="#3b30c8"
            gutterBottom
            sx={{ textDecoration: 'underline' }}
          >
            {user.name}
          </Typography>

          <Typography variant="body1" sx={{ mb: 1 }}>
            <strong>Email:</strong> {user.email}
          </Typography>
          <Typography variant="body1" sx={{ mb: 1 }}>
            <strong>Designation:</strong> {user.designation}
          </Typography>
          <Typography variant="body1" sx={{ mb: 3 }}>
            <strong>Salary:</strong> ₹{user.salary.toLocaleString()}
          </Typography>

          <Stack direction="row" spacing={2} justifyContent="center">
            <Button
              variant="contained"
              color="primary"
              onClick={() => setShowEditModal(true)}
              sx={{ textTransform: 'none' }}
            >
              Edit
            </Button>

            <Button
              variant="outlined"
              color="error"
              onClick={() => setShowDeleteModal(true)}
              sx={{ textTransform: 'none' }}
            >
              Delete
            </Button>
          </Stack>
        </Box>
      </Box>

      <Dialog open={showEditModal} onClose={closeModal} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ color: '#3b30c8' }}>Edit Profile</DialogTitle>
        <DialogContent dividers>
          <Stack spacing={2} mt={1}>
            <TextField
              label="Name"
              name="name"
              fullWidth
              value={formData.name}
              onChange={handleInputChange}
              autoFocus
            />
            <TextField
              label="Designation"
              name="designation"
              fullWidth
              value={formData.designation}
              onChange={handleInputChange}
            />
            <TextField
              label="Salary"
              name="salary"
              fullWidth
              value={formData.salary}
              onChange={handleInputChange}
              type="number"
              inputProps={{ min: 0 }}
            />
            <TextField
              label="Password"
              name="password"
              fullWidth
              value={formData.password}
              onChange={handleInputChange}
              type="password"
              helperText="Leave blank to keep current password"
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeModal} color="inherit">
            Cancel
          </Button>
          <Button onClick={handleSaveEdit} variant="contained" color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={showDeleteModal} onClose={closeModal} maxWidth="xs" fullWidth>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent dividers>
          <Typography>Are you sure you want to delete this user?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeModal} color="inherit">
            Cancel
          </Button>
          <Button onClick={handleDelete} variant="contained" color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Profile;
