import React, { useEffect, useState } from "react";
import { View, Text, FlatList, Image, ScrollView, TextInput, TouchableOpacity } from "react-native";
import api from "./../src/utils/api";

interface Category {
  id: string;
  name: string;
}

interface Product {
  id: string;
  name: string;
  image: string;
  price: number;
}

const HomeScreen = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [topProducts, setTopProducts] = useState<Product[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  // Lấy danh mục sản phẩm
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get("/categories");
        setCategories(response.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);

  // Lấy danh sách sản phẩm bán chạy
  useEffect(() => {
    const fetchTopProducts = async () => {
      try {
        const response = await api.get("/products/top-selling");
        setTopProducts(response.data);
      } catch (error) {
        console.error("Error fetching top products:", error);
      }
    };
    fetchTopProducts();
  }, []);

  // Lazy loading sản phẩm
  const fetchProducts = async () => {
    if (loading) return;
    setLoading(true);
    try {
      const response = await api.get(`/products?page=${page}&limit=10&sort=price_asc`);
      setProducts((prevProducts) => [...prevProducts, ...response.data]);
      setPage(page + 1);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <ScrollView style={{ flex: 1, padding: 10 }}>
      {/* Thanh tìm kiếm */}
      <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 10 }}>
        <TextInput placeholder="Search" style={{ flex: 1, borderWidth: 1, borderRadius: 5, padding: 8 }} />
        <Image source={{ uri: "https://your-user-avatar.com" }} style={{ width: 40, height: 40, borderRadius: 20, marginLeft: 10 }} />
      </View>

      {/* Slide Show Placeholder */}
      <View style={{ height: 150, backgroundColor: "blue", justifyContent: "center", alignItems: "center" }}>
        <Text style={{ color: "white", fontSize: 18 }}>Slide Show</Text>
      </View>

      {/* Danh sách Category */}
      <Text style={{ fontSize: 18, fontWeight: "bold", marginVertical: 10 }}>Danh sách Category</Text>
      <FlatList
        data={categories}
        horizontal
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity style={{ marginRight: 10, padding: 10, backgroundColor: "#ddd", borderRadius: 5 }}>
            <Text>{item.name}</Text>
          </TouchableOpacity>
        )}
      />

      {/* 10 sản phẩm bán chạy */}
      <Text style={{ fontSize: 18, fontWeight: "bold", marginVertical: 10 }}>10 sản phẩm bán chạy</Text>
      <FlatList
        data={topProducts}
        horizontal
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={{ marginRight: 10, padding: 10, backgroundColor: "#fff", borderRadius: 5 }}>
            <Image source={{ uri: item.image }} style={{ width: 80, height: 80 }} />
            <Text>{item.name}</Text>
          </View>
        )}
      />

      {/* Lazy Loading sản phẩm */}
      <Text style={{ fontSize: 18, fontWeight: "bold", marginVertical: 10 }}>Tất cả sản phẩm (Lazy Loading)</Text>
      <FlatList
        data={products}
        keyExtractor={(item) => item.id}
        numColumns={2}
        renderItem={({ item }) => (
          <View style={{ flex: 1, margin: 5, padding: 10, backgroundColor: "#f9f9f9", borderRadius: 5 }}>
            <Image source={{ uri: item.image }} style={{ width: "100%", height: 100 }} />
            <Text>{item.name}</Text>
            <Text>{item.price} đ</Text>
          </View>
        )}
        onEndReached={fetchProducts}
        onEndReachedThreshold={0.5}
      />

      {/* Navigation */}
      <View style={{ height: 50, backgroundColor: "blue", justifyContent: "center", alignItems: "center" }}>
        <Text style={{ color: "white" }}>Navigation</Text>
      </View>
    </ScrollView>
  );
};

export default HomeScreen;
