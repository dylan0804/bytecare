<template>
    <div class="container mx-auto p-6 py-20">
        <el-skeleton style="width: 100%" animated>
        <template #template>
          <div class="xl:flex gap-20">
              <el-skeleton-item variant="image" class="xl:w-1/2 w-full h-[400px]" />
              <div class="w-full xl:w-1/2 mt-20 xl:ml-20 xl:mt-0">
                <el-skeleton />
                <el-divider />
                <el-skeleton :rows="1" />
                <el-divider />
                <el-skeleton :rows="2" />
              </div>
          </div>
        </template>
          </el-skeleton>
    </div>
</template>

<script setup>

</script>