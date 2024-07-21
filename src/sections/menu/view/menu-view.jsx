import PropTypes from 'prop-types';
import { v4 as uuidv4 } from 'uuid';
import React, { useState, useContext } from 'react';

import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import { Box, Stack, Button, Container, TextField, Typography, IconButton } from '@mui/material';
import {
  Save,
  Edit,
  ExpandMore,
  ExpandLess,
  Delete as DeleteIcon,
  CameraAlt as CameraAltIcon,
  AddCircleOutline as AddCircleOutlineIcon,
} from '@mui/icons-material';

import { MyContext } from 'src/Context';
// import { postMenu } from 'src/services/api';

// const MENU = {
//   Appetizers: [
//     {
//       name: 'Caesar Salad',
//       description: 'Fresh romaine lettuce with Caesar dressing and croutons',
//       price: 8.99,
//     },
//     {
//       name: 'Garlic Bread',
//       description: 'Toasted bread with garlic and butter',
//       price: 4.99,
//     },
//   ],
//   'Main Courses': [
//     {
//       name: 'Spaghetti Bolognese',
//       description: 'Spaghetti pasta with rich Bolognese sauce',
//       price: 12.99,
//     },
//     {
//       name: 'Grilled Salmon',
//       description: 'Freshly grilled salmon fillet served with lemon',
//       price: 16.99,
//     },
//   ],
//   Chinese: [
//     {
//       name: 'Spaghetti Bolognese',
//       description: 'Spaghetti pasta with rich Bolognese sauce',
//       price: 12.99,
//     },
//     {
//       name: 'Grilled Salmon',
//       description: 'Freshly grilled salmon fillet served with lemon',
//       price: 16.99,
//     },
//   ],
//   Desserts: [
//     {
//       name: 'Tiramisu',
//       description:
//         'Classic Italian dessert made with layers of coffee-soaked ladyfingers and mascarpone cheese',
//       price: 7.99,
//     },
//     {
//       name: 'Chocolate Brownie',
//       description: 'Warm chocolate brownie served with vanilla ice cream',
//       price: 5.99,
//     },
//   ],
// };

export default function RestaurantMenuAdminView({
  heading,
  onboarding,
  handleSubmit: handleSubmitArg,
}) {
  const { menu: initialMenu } = useContext(MyContext);
  const [expandedCategories, setExpandedCategories] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [menu, setMenu] = useState(initialMenu);
  const handleDishDescriptionChange = (category, dishName) => (event) => {
    const updatedMenu = menu.map((cat) => {
      if (cat.name === category) {
        return {
          ...cat,
          dishes: cat.dishes.map((dish) =>
            dish.name === dishName ? { ...dish, description: event.target.value } : dish
          ),
        };
      }
      return cat;
    });

    setMenu(updatedMenu);
  };
  const handleDishPriceChange = (category, dishName) => (event) => {
    const updatedMenu = menu.map((cat) => {
      if (cat.name === category) {
        return {
          ...cat,
          dishes: cat.dishes.map((dish) =>
            dish.name === dishName ? { ...dish, price: event.target.value } : dish
          ),
        };
      }
      return cat;
    });

    setMenu(updatedMenu);
  };

  const handleSubmit = (menuArg, draft) => {
    const formData = new FormData();
    // Append menu data
    formData.append('menu', JSON.stringify(menuArg));
    // formData.append('name', "Howdy");
    // Append image files
    const dishesWithImages = [];
    Object.values(menuArg).forEach((category) => {
      category.forEach((dish) => {
        if (dish.image instanceof File) {
          formData.append('images', dish.image);
          dishesWithImages.push(dish.name);
        }
      });
    });
    formData.append('imagesUploaded', JSON.stringify(dishesWithImages));
    formData.append('draft', draft);
    // postMenu(formData);
    // handleSubmitArg?.();
  };

  // const handleFileChange = (e) => {
  //   const file = e.target.files[0];
  //   if (file) {
  //     if (file.type === 'application/pdf') {
  //       // Handle the selected PDF file
  //       console.log('Selected file:', file);
  //     } else {
  //       alert('Please select a PDF file.');
  //     }
  //   } else {
  //     console.log('File selection canceled.');
  //   }
  // };
  const handleDishImageChange = (e, categoryName, dishName) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type.startsWith('image/')) {
        const imageUrl = URL.createObjectURL(file);

        const updatedMenu = menu.map((cat) => {
          if (cat.name === categoryName) {
            return {
              ...cat,
              dishes: cat.dishes.map((dish) =>
                dish.name === dishName ? { ...dish, image: imageUrl } : dish
              ),
            };
          }
          return cat;
        });

        setMenu(updatedMenu);
      } else {
        alert('Please select an image file.');
      }
    } else {
      console.log('File selection canceled.');
    }
  };

  const toggleEditMode = (draft) => {
    // Reset edit mode for all categories and dishes
    if (isEditing) {
      handleSubmit(menu, draft);
    }

    setIsEditing(!isEditing);
  };
  const handleAddCategory = () => {
    const newCategoryName = prompt('Enter new category name:');
    if (newCategoryName) {
      // Check for unique category name
      const categoryExists = menu.some(
        (cat) => cat.name.toLowerCase() === newCategoryName.toLowerCase()
      );
      if (categoryExists) {
        alert('Category name already exists. Please enter a unique category name.');
        return;
      }

      const newCategory = {
        name: newCategoryName,
        dishes: [],
        _id: uuidv4(),
      };
      const updatedMenu = [...menu, newCategory].sort((a, b) => a.name.localeCompare(b.name));
      setMenu(updatedMenu);
    }
  };
  const handleAddDish = (category) => {
    const newDishName = prompt('Enter new dish name:');
    const newDishPrice = prompt(`Enter price of ${newDishName}:`);
    if (newDishName) {
      // Check for unique dish name within the category
      const categoryIndex = menu.findIndex((cat) => cat.name === category);
      if (categoryIndex === -1) {
        alert('Category not found.');
        return;
      }

      const dishExists = menu[categoryIndex].dishes.some(
        (dish) => dish.name.toLowerCase() === newDishName.toLowerCase()
      );
      if (dishExists) {
        alert('Dish name already exists in this category. Please enter a unique dish name.');
        return;
      }

      const newDish = {
        name: newDishName,
        description: '',
        price: newDishPrice,
        veg: true,
        _id: uuidv4(),
      };

      const updatedMenu = menu.map((cat) => {
        if (cat.name === category) {
          return {
            ...cat,
            dishes: [...cat.dishes, newDish],
          };
        }
        return cat;
      });

      setMenu(updatedMenu);
    }
  };

  const handleDeleteCategory = (categoryToDelete) => {
    if (window.confirm(`Are you sure you want to delete the category "${categoryToDelete}"?`)) {
      const updatedMenu = menu.filter((cat) => cat.name !== categoryToDelete);
      setMenu(updatedMenu);
    }
  };
  const handleDeleteDish = (category, dishName) => {
    if (window.confirm('Are you sure you want to delete this dish?')) {
      const updatedMenu = menu.map((cat) => {
        if (cat.name === category) {
          return {
            ...cat,
            dishes: cat.dishes.filter((dish) => dish.name !== dishName),
          };
        }
        return cat;
      });

      setMenu(updatedMenu);
    }
  };

  const handleCategoryNameChange = (category) => (event) => {
    const updatedMenu = menu.map((cat) => {
      if (cat.name === category) {
        return {
          ...cat,
          name: event.target.value,
        };
      }
      return cat;
    });

    setMenu(updatedMenu);
  };
  const handleDishNameChange = (category, dishName) => (event) => {
    const updatedMenu = menu.map((cat) => {
      if (cat.name === category) {
        return {
          ...cat,
          dishes: cat.dishes.map((dish) =>
            dish.name === dishName ? { ...dish, name: event.target.value } : dish
          ),
        };
      }
      return cat;
    });

    setMenu(updatedMenu);
  };
  const handleVegNonVegChange = (category, dishName) => (event) => {
    const updatedMenu = menu.map((cat) => {
      if (cat.name === category) {
        return {
          ...cat,
          dishes: cat.dishes.map((dish) =>
            dish.name === dishName ? { ...dish, vegNonVeg: event.target.value } : dish
          ),
        };
      }
      return cat;
    });

    setMenu(updatedMenu);
  };

  const handleExpandCategory = (category) => {
    if (expandedCategories.includes(category)) {
      setExpandedCategories(expandedCategories.filter((cat) => cat !== category));
    } else {
      setExpandedCategories([...expandedCategories, category]);
    }
  };

  const isCategoryExpanded = (category) => expandedCategories.includes(category);

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
          <Button variant="contained" color="inherit" startIcon={<Edit />} onClick={toggleEditMode}>
            {isEditing ? 'Submit Menu' : 'Edit Menu'}
          </Button>
        </Stack>
      </Stack>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {Object.values(menu).map((cat) => (
          <Box key={cat._id} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              {isEditing ? (
                <>
                  <TextField
                    value={cat.name}
                    onChange={handleCategoryNameChange(cat.name)}
                    fullWidth
                  />
                  <Box>
                    <IconButton onClick={() => handleAddDish(cat.name)}>
                      <AddCircleOutlineIcon />
                    </IconButton>
                    <IconButton onClick={() => handleDeleteCategory(cat.name)}>
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </>
              ) : (
                <Typography
                  variant="h5"
                  gutterBottom
                  onClick={() => handleExpandCategory(cat.name.toLowerCase())}
                  sx={{ cursor: 'pointer', margin: 0 }}
                >
                  {cat.name[0].toUpperCase() + cat.name.slice(1)}
                </Typography>
              )}
              <IconButton onClick={() => handleExpandCategory(cat.name.toLowerCase())}>
                {isCategoryExpanded(cat.name.toLowerCase()) ? <ExpandLess /> : <ExpandMore />}
              </IconButton>
            </Box>
            {isCategoryExpanded(cat.name.toLowerCase()) && (
              <>
                {cat?.dishes.map((dish) => (
                  <Box
                    key={dish._id}
                    sx={{
                      display: 'flex',
                      gap: 2,
                      alignItems: 'center',
                    }}
                  >
                    {isEditing ? (
                      <>
                        <label htmlFor={`upload-image-button-${dish.name}`}>
                          <IconButton component="span">
                            {dish.image ? (
                              <img
                                src={dish.image}
                                alt={dish.name}
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
                            id={`upload-image-button-${dish.name}`}
                            type="file"
                            style={{ display: 'none' }}
                            onChange={(e) => handleDishImageChange(e, cat.name, dish.name)}
                          />
                        </label>

                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 1 }}>
                          <Box sx={{ display: 'flex', flexDirection: 'row', gap: '4px', flex: 1 }}>
                            <TextField
                              value={dish.name}
                              onChange={handleDishNameChange(cat.name, dish.name)}
                              placeholder="Name"
                            />
                            <TextField
                              value={dish.price}
                              placeholder="Price"
                              onChange={handleDishPriceChange(cat.name, dish.name)}
                            />
                          </Box>
                          <TextField
                            value={dish.description}
                            placeholder="Description"
                            onChange={handleDishDescriptionChange(cat.name, dish.name)}
                          />
                        </Box>
                        <RadioGroup
                          aria-labelledby="veg-non-veg-radio"
                          value={dish.veg ? 'veg' : 'non-veg'}
                          onChange={() => handleVegNonVegChange(cat.name, dish.name)}
                          name="veg-non-veg-group"
                        >
                          <FormControlLabel value="veg" control={<Radio />} label="Veg" />
                          <FormControlLabel value="non-veg" control={<Radio />} label="Non-Veg" />
                        </RadioGroup>
                        <IconButton onClick={() => handleDeleteDish(cat.name, dish.name)}>
                          <DeleteIcon />
                        </IconButton>
                      </>
                    ) : (
                      <>
                        <img
                          src={dish.image || '/assets/images/dishes/lasagna.png'}
                          alt={dish.name}
                          style={{ width: 100, height: 100, borderRadius: '100%' }}
                        />
                        <Box>
                          <Typography variant="h6">{dish.name}</Typography>
                          <Typography variant="body2">{dish.description}</Typography>
                        </Box>
                        <Typography flex={1} textAlign="right">
                          ${dish.price}
                        </Typography>
                      </>
                    )}
                  </Box>
                ))}
              </>
            )}
          </Box>
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
  // initialMenu: PropTypes.object,
};
