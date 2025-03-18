import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { supabase } from "../client";
import { setLoading, setError, setMusicItems, addMusicItem, updateMusicItem, deleteMusicItem } from "../redux/musicSlice";
    
const AdminPanel = () => {
  const dispatch = useDispatch();
  const musicItems = useSelector((state) => state.music.musicItems);
  const loading = useSelector((state) => state.music.loading);
  const error = useSelector((state) => state.music.error);
  
  const [formData, setFormData] = useState({ name: '', price: '', description: '' });
  const [editingItem, setEditingItem] = useState(null);
  const [editFormData, setEditFormData] = useState({ name: "", price: "", description: "" });

  useEffect(() => {
    const fetchMusicItems = async () => {
      dispatch(setLoading());
      try {
        const { data, error } = await supabase.from('music_items').select('*');
        if (error) throw error;
        dispatch(setMusicItems(data));
      } catch (error) {
        dispatch(setError(error.message));
      }
    };
    fetchMusicItems();
  }, [dispatch]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ 
      ...formData, 
      [name]: name === "price" ? (value ? Number(value) : "") : value 
    });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditFormData({
      ...editFormData,
      [name]: name === "price" ? (value ? Number(value) : "") : value
    });
  };

  const handleAddItem = async (e) => {
    e.preventDefault();
    const { name, price, description } = formData;

    const { data, error } = await supabase
        .from('music_items')
        .insert([{ name, price, description }])
        .select();

    if (error) {
        console.error("Error adding item:", error.message);
    } else if (data && data.length > 0) {
        dispatch(addMusicItem(data[0]));
        setFormData({ name: '', price: '', description: '' });
    } else {
        console.error("Unexpected response: No data returned.");
    }
  };

  const handleUpdateItem = async (id) => {
    const { name, price, description } = editFormData;
    if (price === "" || isNaN(price)) {
        console.error("Invalid price value");
        return;
    }

    const { data, error } = await supabase
      .from('music_items')
      .update({ name, price: Number(price), description })
      .eq('id', id)
      .select();

    if (error) {
        console.error("Error updating item:", error.message);
    } else if (data && data.length > 0) {
        dispatch(updateMusicItem(data[0]));
        setEditingItem(null);
    } else {
        console.error("Unexpected response: No data returned.");
    }
  };

  const handleDeleteItem = async (id) => {
    const { error } = await supabase.from('music_items').delete().eq('id', id);
    if (error) {
      console.error("Error deleting item:", error.message);
    } else {
      dispatch(deleteMusicItem(id));
    }
  };

  return (
    <div className="containerItems">
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <form onSubmit={handleAddItem} className="adminForm">
        <h1>Admin Panel</h1>
        <p>Add new music</p>
        <input type="text" name="name" placeholder="Music Name" value={formData.name} onChange={handleChange} />
        <input type="number" name="price" placeholder="Price" value={formData.price} onChange={handleChange} />
        <input type="text" name="description" placeholder="Description" value={formData.description} onChange={handleChange} />
        <button className="adminBtn" type="submit"><i class='bx bx-plus-medical'></i></button>
      </form>

      <h2>Existing Music Items</h2>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="cards">
          {musicItems.map((item) => (
            <div key={item.id} className="card albom">
              {editingItem === item.id ? (
                <>
                  <div className="actions btns">
                    <button onClick={() => handleUpdateItem(item.id)}><i class='bx bx-check' ></i></button>
                    <button className="otherBtn" onClick={() => setEditingItem(null)}><i class='bx bx-x' ></i></button>
                  </div>
                  <input type="text" name="name" value={editFormData.name} onChange={handleEditChange} />
                  <input type="number" name="price" value={editFormData.price} onChange={handleEditChange} />
                  <input type="text" name="description" value={editFormData.description} onChange={handleEditChange} />
                </>
              ) : (
                <>
                  <div className="details shop">
                  <div className="btns">
                    <button onClick={() => { setEditingItem(item.id); setEditFormData(item); }}><i class='bx bxs-edit-alt'></i></button>
                    <button className="otherBtn" onClick={() => handleDeleteItem(item.id)}><i class='bx bxs-trash-alt' ></i></button>
                  </div>
                  <p className="artist itemdesc">{item.name}</p>
                  <p className="artist">{item.description}</p>
                  <p className="artist itemprice">Price: ${item.price}</p>

                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
