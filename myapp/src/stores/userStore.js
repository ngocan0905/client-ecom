import { defineStore } from "pinia";
import axiosClient from "../api/axiosClient";
import axiosAdmin from "../api/axiosAdmin";
import Cookies from "js-cookie";

export const useUserStore = defineStore("user", {
  state: () => ({}),

  actions: {
    async getUserById(id) {
      try {
        const response = await axiosClient.get(`user/${id}`);
        return response.data;
      } catch (error) {
        console.log("get user by id fail", error);
      }
    },
    async loginUser(email, password) {
      try {
        const request = await axiosClient.post("/user/login", {
          email: email,
          password: password,
        });
        const token = request.data.token;
        Cookies.set(request.data.role, token);

        return request.data;
      } catch (error) {
        console.error(error);
        throw new Error("loggin fail");
      }
    },

    async registerUser(displayName, email, phoneNumber, password) {
      try {
        await axiosClient.post("/user/register", {
          displayName: displayName,
          email: email,
          mobile: phoneNumber,
          password: password,
        });
        this.loginUser(email, password);
      } catch (error) {
        console.log(error);
      }
    },
    // logou user
    async logout() {
      try {
        const admin = Cookies.get("admin");
        const user = Cookies.get("user");

        if (admin) {
          await axiosClient.get("/user/logout", {
            headers: {
              Authorization: `Bearer ${admin}`,
            },
          });
          Cookies.remove("admin");
          console.log("Admin cookie removed");
        }

        if (user) {
          await axiosClient.get("/user/logout", {
            headers: {
              Authorization: `Bearer ${user}`,
            },
          });
          Cookies.remove("admin");
          console.log("Admin cookie removed");
        }

        console.log("Logout Successed");
        return "Logout Successed";
      } catch (error) {
        console.log("Logout failed", error);
        throw new Error("Logout failed");
      }
    },

    async addToCart(productId, count, color) {
      try {
        const cartItem = {
          _id: productId,
          count: count,
          color: color,
        };
        await axiosClient.post("user/cart", { cart: [cartItem] });
        console.log("add product successed");
      } catch (error) {
        console.log("add product to cart fail", error);
      }
    },
    async loadProductInCart() {
      const response = await axiosClient.get("user/cart");
      return response.data;
    },
    async removeProductFromCartByid(productId) {
      try {
        const request = await axiosClient.delete(`user/cart/delete-by-id/${productId}`);

        return request.data;
      } catch (error) {
        console.log(error);
      }
    },
    async removeAllProductInCart() {
      try {
        const request = await axiosClient.delete("user/cart");
        return request.data;
      } catch (error) {
        console.log(error);
      }
    },
    async applyCoupon(code) {
      try {
        const request = await axiosClient.post("user/cart/apply-coupon", {
          coupon: code,
        });
        return request.data;
      } catch (error) {
        console.log(error);
      }
    },

    // admin role
    async registerAdmin(firstName, lastName, email, phoneNumber, password) {
      try {
        const request = await axiosAdmin.post("/user/register", {
          firstName: firstName,
          lastName: lastName,
          email: email,
          mobile: phoneNumber,
          password: password,
          role: "admin",
        });
        return request.data;
      } catch (error) {
        console.log(error);
      }
    },
    async blockUser(userId) {
      try {
        const request = await axiosAdmin.put(`user/block-user/${userId}`);
        return request.data;
      } catch (error) {
        console.log(error);
      }
    },
    async unblockUser(userId) {
      try {
        const request = await axiosAdmin.put(`user/unblock-user/${userId}`);
        return request.data;
      } catch (error) {
        console.log(error);
      }
    },
    async deleteUser(userId) {
      try {
        const request = await axiosAdmin.delete(`user/${userId}`);
        return request.data;
      } catch (error) {
        console.log(error);
      }
    },
    async createOder(paymentDetails) {
      try {
        const request = await axiosClient.post("user/cart/create-order", paymentDetails);
        return request.data;
      } catch (error) {
        console.error(error);
        throw new Error("failed to create order");
      }
    },
    async getOrder() {
      try {
        const response = await axiosClient.get("user/get-order");
        return response.data;
      } catch (error) {
        console.error(error);
        throw new Error(" lỗi khi lấy hóa đơn của giỏ hàng");
      }
    },
    async getAllOrder(page) {
      try {
        const response = await axiosAdmin.get(`user/sold-order?page=${page}`);
        return response.data;
      } catch (error) {
        console.error(error);
        throw new Error("lỗi khi lấy danh sách mua hàng");
      }
    },
    async getRevenueByDay(date) {
      try {
        const response = await axiosAdmin.get(`user/chart/${date}`);
        return response.data;
      } catch (error) {
        console.error(error);
        throw new Error("Lỗi khi lấy thống kê doanh thu theo ngày");
      }
    },

    async getRevenueByMonth(year, month) {
      try {
        const response = await axiosAdmin.get(`user/chart/month/${year}/${month}`);
        return response.data;
      } catch (error) {
        console.error(error);
        throw new Error("Lỗi khi lấy thống kê doanh thu theo tháng");
      }
    },
  },
});
