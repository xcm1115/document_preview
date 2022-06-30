<script setup>
import { reactive } from 'vue';
import { message } from "ant-design-vue";
import { PlusOutlined, FileTextOutlined } from "@ant-design/icons-vue";
import { useRouter } from 'vue-router';
import { BUCKET_URL } from "../constants";

const router = useRouter();

const state = reactive({
  hasFile: false,
  uploadUrl: "",
  fileName: "",
  htmlSrc: "",
});

const handleUpload = file => {
  console.log(file.name);
  state.hasFile = true;
  state.uploadUrl = `${BUCKET_URL}/${file.name}`;
  state.fileName = file.name;

  return true;
};

const handleChange = info => {
  if (info.file.status !== 'uploading') {
    console.log(info.file);
  }

  if (info.file.status === 'done') {
    state.htmlSrc = `${BUCKET_URL}/${state.fileName}?ci-process=doc-preview&dstType=html`
    message.success(`${info.file.name} uploaded successfully`);
  } else if (info.file.status === 'error') {
    message.error(`${info.file.name} upload failed.`);
  }
};

const removeFile = () => {
  state.hasFile = false;
  state.uploadUrl = "";
  state.fileName = "";
  state.htmlSrc = "";
};

const toPreview = () => {
  router.push({
    path: "Preview",
    query: {
      file: state.fileName,
    },
  });

};
</script>

<template>
  <div class="container">
    <div class="uploader-box">
      <div class="uploader">
        <a-upload name="file" :action="state.uploadUrl" method="put" :beforeUpload="handleUpload" :maxCount="1"
          @change="handleChange" @remove="removeFile">
          <plus-outlined v-if="!state.hasFile" class="file-icon" />
          <file-text-outlined v-if="state.hasFile" class="file-icon" />
          <p>Click to upload file</p>
        </a-upload>
      </div>

      <div v-if="state.hasFile" class="preview">
        <a-button class="preview-button" :href="state.htmlSrc" target="_blank">HTML Preview</a-button>
        <a-button class="preview-button" type="primary" @click="toPreview">Image Preview</a-button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.container {
  height: 80vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.uploader-box {
  width: 20rem;
}

.uploader {
  padding: 25px 20px 20px 20px;
  outline: 1px dashed #ccc;
}

.file-icon {
  margin-bottom: 20px;
  font-size: 30px;
  color: #1890ff;
}

.preview {
  margin-top: 30px;
  display: flex;
  justify-content: space-between;
}

.preview-button {
  padding: 0;
  width: 45%;
  height: 3rem;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
