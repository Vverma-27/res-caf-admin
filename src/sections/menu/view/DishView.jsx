// Dish.jsx
import PropTypes from 'prop-types';
import React, { useState, useContext } from 'react';

import { Delete as DeleteIcon, CameraAlt as CameraAltIcon } from '@mui/icons-material';
import {
  Box,
  Radio,
  Switch,
  TextField,
  RadioGroup,
  IconButton,
  Typography,
  FormControlLabel,
} from '@mui/material';

import { MyContext } from 'src/Context';
import { deleteDish, setDishUnavailable } from 'src/services/api';

const Dish = ({ dish: dishArg, cat, isEditing, setMenu, menu, catId }) => {
  const [available, setAvailable] = useState(!dishArg.unavailable);
  const { socket } = useContext(MyContext);
  const [loading, setLoading] = useState(false);
  const handleDishNameChange = (category, dishName) => (event) => {
    const updatedMenu = {
      ...menu,
      [category.toLowerCase()]: {
        ...menu[category.toLowerCase()],
        dishes: menu[category.toLowerCase()].dishes.map((dish) =>
          dish.name.toLowerCase() === dishName.toLowerCase()
            ? { ...dish, name: event.target.value }
            : dish
        ),
      },
    };

    setMenu(updatedMenu);
  };
  const handleDishImageChange = (e, categoryName, dishName) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type.startsWith('image/')) {
        const imageUrl = URL.createObjectURL(file);

        const updatedMenu = {
          ...menu,
          [categoryName]: {
            ...menu[categoryName],
            dishes: menu[categoryName].dishes.map((dish) =>
              dish.name === dishName ? { ...dish, imageFile: file, image: imageUrl } : dish
            ),
          },
        };

        setMenu(updatedMenu);
      } else {
        alert('Please select an image file.');
      }
    } else {
      console.log('File selection canceled.');
    }
  };
  const handleVegNonVegChange = (category, dishName) => (event) => {
    console.log(event.target.value);
    const updatedMenu = {
      ...menu,
      [category]: {
        ...menu[category],
        dishes: menu[category].dishes.map((dish) =>
          dish.name === dishName ? { ...dish, veg: event.target.value === 'veg' } : dish
        ),
      },
    };

    setMenu(updatedMenu);
  };
  const handleDeleteDish = (category, dishName) => {
    if (window.confirm(`Are you sure you want to delete ${dishName}?`)) {
      const updatedMenu = {
        ...menu,
        [category.toLowerCase()]: {
          ...menu[category.toLowerCase()],
          dishes: menu[category.toLowerCase()].dishes.filter((dish) => {
            const dishToBeDeleted = dish.name.toLowerCase() === dishName.toLowerCase();
            if (dishToBeDeleted && !dish.created && !menu[category.toLowerCase()].created) {
              deleteDish(dish._id, menu[category.toLowerCase()]._id);
            }
            return !dishToBeDeleted;
          }),
        },
      };
      setMenu(updatedMenu);
    }
  };
  const handleDishDescriptionChange = (category, dishName) => (event) => {
    const updatedMenu = {
      ...menu,
      [category]: {
        ...menu[category],
        dishes: menu[category].dishes.map((dish) =>
          dish.name === dishName ? { ...dish, description: event.target.value } : dish
        ),
      },
    };

    setMenu(updatedMenu);
  };

  const handleDishPriceChange = (category, dishName) => (event) => {
    const updatedMenu = {
      ...menu,
      [category]: {
        ...menu[category],
        dishes: menu[category].dishes.map((dish) =>
          dish.name === dishName ? { ...dish, price: event.target.value } : dish
        ),
      },
    };

    setMenu(updatedMenu);
  };
  return (
    <Box
      sx={{
        display: 'flex',
        gap: 2,
        alignItems: 'center',
        position: 'relative',
      }}
    >
      {isEditing ? (
        <>
          <label htmlFor={`upload-image-button-${dishArg.name}`}>
            <IconButton component="span">
              {dishArg.image ? (
                <img
                  src={dishArg.image}
                  alt={dishArg.name}
                  style={{ width: 100, height: 100, borderRadius: '50%' }}
                />
              ) : (
                <div
                  style={{
                    width: 100,
                    height: 100,
                    borderRadius: '50%',
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    position: 'relative',
                  }}
                >
                  <CameraAltIcon
                    style={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      color: '#fff',
                    }}
                  />
                </div>
              )}
            </IconButton>
            <input
              accept="image/*"
              id={`upload-image-button-${dishArg.name}`}
              type="file"
              style={{ display: 'none' }}
              onChange={(e) => handleDishImageChange(e, cat, dishArg.name)}
            />
          </label>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 1 }}>
            <Box sx={{ display: 'flex', flexDirection: 'row', gap: '4px', flex: 1 }}>
              <TextField
                value={dishArg.name}
                onChange={handleDishNameChange(cat, dishArg.name)}
                placeholder="Name"
              />
              <TextField
                value={dishArg.price}
                placeholder="Price"
                onChange={handleDishPriceChange(cat, dishArg.name)}
              />
            </Box>
            <TextField
              value={dishArg.description}
              placeholder="Description"
              onChange={handleDishDescriptionChange(cat, dishArg.name)}
            />
          </Box>
          <RadioGroup aria-labelledby="veg-non-veg-radio" name="veg-non-veg-group">
            <FormControlLabel
              value="veg"
              control={<Radio />}
              label="Veg"
              checked={dishArg.veg}
              onChange={(e) => handleVegNonVegChange(cat, dishArg.name)(e)}
            />
            <FormControlLabel
              value="non-veg"
              checked={!dishArg.veg}
              onChange={(e) => handleVegNonVegChange(cat, dishArg.name)(e)}
              control={<Radio />}
              label="Non-Veg"
            />
          </RadioGroup>
          <IconButton onClick={() => handleDeleteDish(cat, dishArg.name)}>
            <DeleteIcon />
          </IconButton>
        </>
      ) : (
        <>
          <img
            src={dishArg.image || '/assets/images/dishes/lasagna.png'}
            alt={dishArg.name}
            style={{ width: 100, height: 100, borderRadius: '100%' }}
          />
          <Box>
            <Typography variant="h6">{dishArg.name}</Typography>
            <Typography variant="body2">{dishArg.description}</Typography>
          </Box>
          <Typography flex={1} textAlign="right">
            ₹{dishArg.price}
          </Typography>
          <img
            src={`/assets/${dishArg.veg ? 'veg' : 'non-veg'}-icon.png`}
            alt="veg icon"
            style={{
              alignSelf: 'flex-start',
              height: '20px',
            }}
          />
          <FormControlLabel
            value="top"
            control={
              <Switch
                checked={available}
                onChange={async (e) => {
                  if (loading) return;
                  const { checked } = e.target;
                  setLoading(true);
                  await setDishUnavailable(dishArg._id, catId, checked);
                  socket.emit('availability', { dishId: dishArg._id, available: checked });
                  setAvailable(checked);
                  setLoading(false);
                }}
                color="primary"
              />
            }
            label="Available?"
            labelPlacement="top"
          />
        </>
      )}
    </Box>
  );
};

Dish.propTypes = {
  dish: PropTypes.object.isRequired,
  cat: PropTypes.string.isRequired,
  isEditing: PropTypes.bool.isRequired,
  setMenu: PropTypes.func.isRequired,
  menu: PropTypes.object.isRequired,
  catId: PropTypes.string,
};

export default Dish;
