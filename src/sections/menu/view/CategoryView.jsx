// Category.jsx
import React from 'react';
import PropTypes from 'prop-types';
import { v4 as uuidv4 } from 'uuid';

import { Box, TextField, Typography, IconButton } from '@mui/material';
import {
  ExpandMore,
  ExpandLess,
  Delete as DeleteIcon,
  AddCircleOutline as AddCircleOutlineIcon,
} from '@mui/icons-material';

import { deleteCategory } from 'src/services/api';

import Dish from './DishView';

const Category = ({ category, categoryName, isEditing, expanded, onExpand, setMenu, menu }) => {
  const handleAddDish = (cat) => {
    const newDishName = prompt('Enter new dish name:');
    const newDishPrice = prompt(`Enter price of ${newDishName}:`);
    if (newDishName) {
      // Check for unique dish name within the cat
      const dishExists = menu[cat.toLowerCase()].dishes.some(
        (dish) => dish.name.toLowerCase() === newDishName.toLowerCase()
      );
      if (dishExists) {
        alert('Dish name already exists in this category. Please enter a unique dish name.');
        return;
      }

      const newDish = {
        _id: uuidv4(),
        name: newDishName,
        description: '',
        price: newDishPrice,
        veg: true,
        created: true,
      };

      const updatedMenu = {
        ...menu,
        [cat.toLowerCase()]: {
          ...menu[cat.toLowerCase()],
          dishes: [...menu[cat.toLowerCase()].dishes, newDish],
        },
      };

      setMenu(updatedMenu);
    }
  };

  const handleDeleteCategory = (categoryToDelete) => {
    if (window.confirm(`Are you sure you want to delete the cat "${categoryToDelete}"?`)) {
      const updatedMenu = { ...menu };
      if (!updatedMenu[categoryToDelete.toLowerCase()].created)
        deleteCategory(updatedMenu[categoryToDelete.toLowerCase()]._id);
      delete updatedMenu[categoryToDelete.toLowerCase()];
      setMenu(updatedMenu);
    }
  };

  const handleCategoryNameChange = (cat) => (event) => {
    const updatedMenu = {
      ...menu,
      [event.target.value.toLowerCase()]: menu[cat.toLowerCase()],
    };
    delete updatedMenu[cat.toLowerCase()];

    setMenu(updatedMenu);
  };

  return (
    <Box key={category._id} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        {isEditing ? (
          <>
            <TextField
              value={categoryName}
              onChange={handleCategoryNameChange(categoryName)}
              fullWidth
            />
            <Box>
              <IconButton onClick={() => handleAddDish(categoryName)}>
                <AddCircleOutlineIcon />
              </IconButton>
              <IconButton onClick={() => handleDeleteCategory(categoryName)}>
                <DeleteIcon />
              </IconButton>
            </Box>
          </>
        ) : (
          <Typography
            variant="h5"
            gutterBottom
            onClick={() => onExpand(categoryName)}
            sx={{ cursor: 'pointer', margin: 0 }}
          >
            {categoryName[0].toUpperCase() + categoryName.slice(1)}
          </Typography>
        )}
        <IconButton onClick={() => onExpand(categoryName)}>
          {expanded ? <ExpandLess /> : <ExpandMore />}
        </IconButton>
      </Box>
      {expanded && (
        <>
          {category?.dishes.map((dish) => (
            <Dish
              key={dish._id}
              dish={dish}
              cat={categoryName}
              isEditing={isEditing}
              setMenu={setMenu}
              menu={menu}
              catId={category._id}
            />
          ))}
        </>
      )}
    </Box>
  );
};

Category.propTypes = {
  category: PropTypes.object.isRequired,
  categoryName: PropTypes.string.isRequired,
  isEditing: PropTypes.bool.isRequired,
  expanded: PropTypes.bool.isRequired,
  onExpand: PropTypes.func.isRequired,
  setMenu: PropTypes.func.isRequired,
  menu: PropTypes.object.isRequired,
};

export default Category;
