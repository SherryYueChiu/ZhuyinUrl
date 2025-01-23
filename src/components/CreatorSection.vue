<script setup lang="ts">
import { ref } from "vue";
import Swal from "sweetalert2";
import copy from "clipboard-copy";

const DEFAULT_URL = "";
const inputBox = ref<HTMLInputElement>();
const inputValue = ref<string>("");
const urlPreview = ref<string>("");

function subimt() {
  try {
    const newUrl = predictZhuyinUrl();
    if (typeof newUrl === "string") {
      Swal.fire({
        title: "來了",
        text: newUrl,
        icon: "success",
        confirmButtonText: "複製",
      });
      copy(newUrl);
    } else throw newUrl;
  } catch (error) {
    Swal.fire({
      title: "遇到狀況了",
      text: error.message,
      icon: "error",
    });
  }
}

function predictZhuyinUrl() {
  let token = "";
  urlPreview.value = DEFAULT_URL;
  try {
    if (inputValue.value.trim() === "") {
      return new Error("你是空手來的嗎？");
    } else if (inputValue.value.startsWith("http")) {
      if (!inputValue.value.includes("reurl.cc")) {
        return new Error("現在只認reurl的短網址噢");
      }
      token = (window as any).extractTailFromUrl(inputValue.value);
    } else {
      return new Error("我吃不出這是什麼網址");
    }
    const translated = (window as any).base62ToZhuyin(token);
    const newUrl = `http://url.sherryyue.life/?q=${translated}`;
    urlPreview.value = newUrl;
    return newUrl;
  } catch (error) {
    return new Error(error.message);
  }
}
</script>

<template>
  <div class="input-section">
    <h2>製作短網址</h2>
    <input
      ref="inputBox"
      type="text"
      v-model="inputValue"
      placeholder="https://reurl.cc/oVA9Lg"
      @input="predictZhuyinUrl"
    />
    <button
      @click="subimt()"
      :disabled="!inputValue"
      :class="{ disabled: !inputValue }"
    >
      <span>變身</span>
    </button>
    <a class="preview-url" :href="urlPreview || DEFAULT_URL">{{
      urlPreview || DEFAULT_URL
    }}</a>
  </div>
</template>

<style scoped>
.input-section {
  flex: 1;
  padding: 3rem;
  box-sizing: border-box;
}

.input-section h2 {
  margin-bottom: 1rem;
}

.input-section input {
  width: 100%;
  padding: 0.5rem;
  background-color: white;
  color: black;
  box-sizing: border-box;
  border-radius: 0.5rem 0.5rem 0 0;
  text-align: center;
  font-size: x-large;
  &::placeholder {
    color: #ddd;
  }
}

.input-section button {
  width: 100%;
  padding: 1rem;
  background-color: rebeccapurple;
  color: white;
  border: none;
  cursor: pointer;
  border-radius: 0 0 0.5rem 0.5rem;
  &.disabled {
    background-color: #666;
    cursor: not-allowed;
  }
}

.input-section .preview-url {
  color: white;
  opacity: 0.3;
}
</style>
