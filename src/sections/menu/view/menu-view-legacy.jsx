import PropTypes from 'prop-types';
import { v4 as uuidv4 } from 'uuid';
import React, { useState, useContext } from 'react';

import { Box, Stack, Button, Container, Typography } from '@mui/material';
import { Save, Edit, AddCircleOutline as AddCircleOutlineIcon } from '@mui/icons-material';

import { MyContext } from 'src/Context';
import { postMenu } from 'src/services/api';

import Category from './CategoryView';

export default function RestaurantMenuAdminView({
  heading,
  onboarding,
  handleSubmit: handleSubmitArg,
}) {
  const { menu: initialMenu } = useContext(MyContext);
  const [expandedCategories, setExpandedCategories] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [menu, setMenu] = useState(initialMenu);

  const handleExpandCategory = (category) => {
    setExpandedCategories((prevExpandedCategories) => {
      if (prevExpandedCategories.includes(category)) {
        return prevExpandedCategories.filter((cat) => cat !== category);
      }
      return [...prevExpandedCategories, category];
    });
  };

  console.log('🚀 ~ handleSubmit ~ menuArg:', menu);
  const handleSubmit = (menuArg, draft) => {
    const formData = new FormData();
    // Append menu data
    console.log('🚀 ~ handleSubmit ~ menuArg:', menuArg);
    // Append image files
    const dishesWithImages = [];
    Object.values(menuArg).forEach((category) => {
      delete category.created;
      category.dishes.forEach((dish) => {
        delete dish.created;
        if (dish.image && dish.imageFile) {
          delete dish.image;
          dish.image = dish.imageFile;
          delete dish.imageFile;
        }
        if (dish.image instanceof File) {
          formData.append('images', dish.image);
          dishesWithImages.push(dish.name);
        }
      });
    });
    formData.append('imagesUploaded', JSON.stringify(dishesWithImages));
    // console.log('🚀 ~ handleSubmit ~ menuArg:', menuArg);
    formData.append('menu', JSON.stringify(menuArg));
    formData.append('draft', draft);
    postMenu(formData);
    handleSubmitArg?.(draft);
  };

  const toggleEditMode = (draft) => {
    // Reset edit mode for all categories and dishes\

    if (isEditing) {
      handleSubmit(menu, draft);
    }

    setIsEditing(!isEditing);
  };

  const handleAddCategory = () => {
    const newCategoryName = prompt('Enter new category name:');
    if (newCategoryName) {
      // Check for unique category name
      const categoryExists = menu[newCategoryName.toLowerCase()];
      if (categoryExists) {
        alert('Category name already exists. Please enter a unique category name.');
        return;
      }

      const newCategory = {
        _id: uuidv4(),
        dishes: [],
        created: true,
      };
      const updatedMenu = {
        ...menu,
        [newCategoryName.toLowerCase()]: newCategory,
      };

      setMenu(updatedMenu);
    }
  };

  const isCategoryExpanded = (category) => expandedCategories.includes(category.toLowerCase());

  return (
    <Container sx={{ padding: 2, position: 'relative' }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
        <Typography variant="h4">{heading || 'Menu'}</Typography>
        <Stack direction="row" alignItems="center" justifyContent="center" gap={2}>
          {isEditing && onboarding ? (
            <Button
              variant="contained"
              color="inherit"
              startIcon={<Save />}
              onClick={(e) => toggleEditMode(true)}
            >
              Save Draft
            </Button>
          ) : null}
          <Button
            variant="contained"
            color="inherit"
            startIcon={<Edit />}
            onClick={(e) => toggleEditMode(false)}
          >
            {isEditing ? 'Submit Menu' : 'Edit Menu'}
          </Button>
        </Stack>
      </Stack>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {Object.keys(menu).map((cat) => (
          <Category
            key={menu[cat]._id}
            category={menu[cat]}
            categoryName={cat}
            isEditing={isEditing}
            expanded={isCategoryExpanded(cat)}
            onExpand={handleExpandCategory}
            // onAddDish={handleAddCategory}
            // onDeleteCategory={handleDeleteCategory}
            // onCategoryNameChange={handleCategoryNameChange}
            setMenu={setMenu}
            menu={menu}
          />
          // const category = menu[cat];
          // return (
          // );
        ))}
        {(isEditing && (
          <Button
            variant="contained"
            color="inherit"
            startIcon={<AddCircleOutlineIcon />}
            onClick={() => handleAddCategory()}
          >
            Add Category
          </Button>
        )) ||
          null}
        {isEditing ? (
          <Button sx={{ alignSelf: 'flex-start' }} onClick={() => setIsEditing(false)}>
            Discard Changes
          </Button>
        ) : null}
      </Box>
    </Container>
  );
}

RestaurantMenuAdminView.propTypes = {
  heading: PropTypes.string,
  onboarding: PropTypes.bool,
  handleSubmit: PropTypes.func,
};
