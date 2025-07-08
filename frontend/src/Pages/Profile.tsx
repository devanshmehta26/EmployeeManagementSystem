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
import { api } from '../utils/api';
import { useFormHandler } from '../Hooks/useFormHandler';

const Profile: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const user = useSelector((state: RootState) => state.auth.user);

  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

const {
    values: form,
    setValues,
    handleChange,
    handleSubmit,
  } = useFormHandler({
    initialValues: {
      name: user?.name || '',
      designation: user?.designation || '',
      salary: user?.salary?.toString() || '',
      password: '',
    },
    validate: (form) => {
    if (!form.name.trim()) {      
      toast.error('Please enter your name.'); 
      return "";
    }    
   if (!form.designation.trim())  {
      toast.error('Please enter your designation.'); 
      return "";
   }
    if (!form.salary || isNaN(Number(form.salary)) || Number(form.salary) <= 0) {
      toast.error('Salary must be a positive number.'); 
      return "";
    }
    return null;
  },
  onSubmit: async (form) => {
    try {
      const updated = {
        name: form.name,
        designation: form.designation,
        salary: Number(form.salary),
        ...(form.password ? { password: form.password } : {}),
      };

     const response = await api.updateUser(updated);

      dispatch(setUser(response.data.employee));
      setShowEditModal(false);
      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error('Failed to update profile');
    }
  }
});


  useEffect(() => {
    if (user) {
      setValues({
        name: user.name,
        designation: user.designation,
        salary: user.salary.toString(),
        password: '',
      });
    }
  }, [user, setValues]);

  const handleDelete = async () => {
    try {
      await api.deleteUser();
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
      setValues({
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
          minHeight: '90vh',
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
            borderTop: '6px solid #3b30c8'
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
              sx={{ backgroundColor: '#3b30c8', color: '#fff' }}
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
        <DialogTitle align='center' sx={{ color: '#3b30c8' }}>Edit Profile</DialogTitle>
        <DialogContent dividers>
          <Stack spacing={2} mt={1}>
            <TextField
              label="Name"
              name="name"
              fullWidth
              value={form.name}
              onChange={handleChange}
              autoFocus
            />
            <TextField
              label="Designation"
              name="designation"
              fullWidth
              value={form.designation}
              onChange={handleChange}
            />
            <TextField
              label="Salary"
              name="salary"
              fullWidth
              value={form.salary}
              onChange={handleChange}
              type="number"
              inputProps={{ min: 0 }}
            />
            <TextField
              label="Password"
              name="password"
              fullWidth
              value={form.password}
              onChange={handleChange}
              type="password"
              helperText="Leave blank to keep current password"
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeModal} color="inherit">
            Cancel
          </Button>
          <Button
            onClick={async (e) => {
              try {
                await handleSubmit(e);
              } catch (msg) {
                if (typeof msg === 'string') toast.error(msg);
              }
            }}
            variant="contained"
            sx={{ backgroundColor: '#3b30c8', color: '#fff' }}
          >
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
