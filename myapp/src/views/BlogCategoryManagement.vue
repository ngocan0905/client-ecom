<template>
  <AdminLayout>
    <div>
      <div class="grid grid-cols-12 my-4">
        <div
          class="col-span-3 border-2 border-gray-800 text-lg font-semibold mx-4 px-4 py-2 rounded text-center"
        >
          Blog Total : {{ listBlogCategory.length }}
        </div>
      </div>
      <div
        v-for="cate in listBlogCategory"
        :key="cate._id"
        class="py-2 px-4 border-b grid grid-cols-12 text-lg"
      >
        <ListBlogCategory :data="cate" @deleteBlogCategory="deleteBlogCat" />
      </div>
    </div>
  </AdminLayout>
</template>
<script setup>
import { onMounted, ref } from "vue";
import AdminLayout from "../layouts/AdminLayout.vue";
import ListBlogCategory from "../components/ListBlogCategory.vue";
import { useBlogStore } from "../stores/blogStore";
import { useGeneralStore } from "../stores/generalStore";
const generalStore = useGeneralStore();
const blogStore = useBlogStore();
const listBlogCategory = ref([]);
onMounted(async () => {
  listBlogCategory.value = await blogStore.getBlogCategory();
});
const deleteBlogCat = async (id) => {
  try {
    generalStore.isLoading = true;
    const deleted = await blogStore.deleteBlogCategory(id);
    if (deleted) {
      const listBeforeDelete = listBlogCategory.value.filter((blogCat) => blogCat._id !== id);
      listBlogCategory.value = listBeforeDelete;
      generalStore.isLoading = false;
    }
  } catch (error) {
    console.log(error);
  }
};
</script>
