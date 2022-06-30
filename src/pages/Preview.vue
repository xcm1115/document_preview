<script setup>
import { onMounted, reactive } from "vue";
import { useRouter, useRoute } from "vue-router";
import { message } from "ant-design-vue";
import axios from "axios";
import { BUCKET_URL } from "../constants";

const router = useRouter();
const route = useRoute();

const state = reactive({
  fileName: "",
  totalPages: 1,
  curPage: 1,
  imgSrcArr: [],
});

onMounted(() => {
  state.fileName = route.query.file;
  preview();
});

const goBack = () => {
  router.push("/");
};

const getImage = async (page) => {
  const url = `${BUCKET_URL}/${state.fileName}?ci-process=doc-preview&page=${page}`;

  const res = await axios({
    method: "get",
    url,
    responseType: "blob",
  });

  return res;
}

const preview = async () => {


  try {
    const res = await getImage(1);

    state.totalPages = res.headers["x-total-page"];
    const src = URL.createObjectURL(res.data);
    state.imgSrcArr.push(src);
  } catch (error) {
    console.log(error);
    message.error(`The file cannot be previewed`);
  }
};

const prevImage = () => {
  if (state.curPage === 1) {
    message.warning("It's the first one");
    return;
  }

  state.curPage--;
};

const nextImage = async () => {
  if (state.curPage == state.totalPages) {
    message.warning("It's the last one");
    return;
  }

  if (state.curPage + 1 > state.imgSrcArr.length) {
    const res = await getImage(state.curPage + 1);
    const src = URL.createObjectURL(res.data);
    state.imgSrcArr.push(src);
  }

  state.curPage++;
};
</script>

<template>
  <a-page-header title="Preview" @back="goBack">
    <template #extra>

      <a-button key="2" @click="prevImage">Prev</a-button>
      <span>当前页数：{{ state.curPage }} / {{ state.totalPages }}</span>
      <a-button key="1" @click="nextImage">Next</a-button>
    </template>
  </a-page-header>

  <a-image with="80%" :src="state.imgSrcArr[state.curPage - 1]" />
</template>

<style scoped>
</style>
