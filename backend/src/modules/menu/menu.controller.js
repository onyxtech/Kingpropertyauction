import * as menuService from "./menu.service.js";

export const create = async (req, res) => {
  try {
    const menu = await menuService.createMenu(req.body, req.user._id);
    res.status(201).json({ success: true, data: menu, message: "Menu created" });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getAll = async (req, res) => {
  try {
    const menus = await menuService.getMenus();
    res.status(200).json({ success: true, data: menus });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getById = async (req, res) => {
  try {
    const menu = await menuService.getMenuById(req.params.id);
    res.status(200).json({ success: true, data: menu });
  } catch (error) {
    res.status(404).json({ success: false, message: error.message });
  }
};

export const update = async (req, res) => {
  try {
    const menu = await menuService.updateMenu(req.params.id, req.body);
    res.status(200).json({ success: true, data: menu, message: "Menu updated" });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const remove = async (req, res) => {
  try {
    await menuService.deleteMenu(req.params.id);
    res.status(200).json({ success: true, message: "Menu deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const duplicate = async (req, res) => {
  try {
    const menu = await menuService.duplicateMenu(req.params.id, req.user._id);
    res.status(201).json({ success: true, data: menu, message: "Menu duplicated" });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};