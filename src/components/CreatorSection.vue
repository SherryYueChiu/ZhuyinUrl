<script setup lang="ts">
import { ref } from "vue";
import Swal from "sweetalert2";
import copy from "clipboard-copy";
import { extractTailFromUrl, base62ToZhuyin } from "../service";

const inputBox = ref<HTMLInputElement>();
const inputValue = ref<string>("");

function subimt() {
  let token = "";
  try {
    if (inputValue.value.trim() === "") {
      throw new Error("你是空手來的嗎？");
    } else if (inputValue.value.startsWith("http")) {
      token = extractTailFromUrl(inputValue.value);
    } else {
      throw new Error("我吃不出這是什麼網址");
    }
    const translated = base62ToZhuyin(token);
    const newUrl = `https://zhu-yin-url.vercel.app/?q=${translated}`;
    Swal.fire({
      title: "來了",
      text: newUrl,
      icon: "success",
      confirmButtonText: "複製",
    });
    copy(newUrl);
  } catch (error) {
    Swal.fire({
      title: "遇到狀況了",
      text: error.message,
      icon: "error",
    });
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
    />
    <button
      @click="subimt()"
      :disabled="!inputValue"
      :class="{ disabled: !inputValue }"
    >
      <span>變身</span>
    </button>
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
</style>
