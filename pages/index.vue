<template>
  <div v-if="products">
    <div class="card flex justify-center">
      <Select
        v-model="currentLang"
        :options="langs"
        placeholder="Lang"
        class="w-full md:w-56"
      />
    </div>

    <DataTable
      :value="products"
      v-model:expandedRows="expandedRows"
      tableStyle="min-width: 60rem"
      dataKey="id"
      class="table"
    >
      <Column expander style="width: 5rem" />
      <Column :header="columnsName[currentLang].name">
        <template #body="slotProps">
          <button
            class="plain-butt"
            @click="
              handleCategoryClick(
                localizedContent(slotProps.data as Category).link
              )
            "
          >
            {{ localizedContent(slotProps.data as Category).cg_name }}
          </button>
          <span v-if="(slotProps.data as Category).path_to_top?.length">
            <Breadcrumb
              :model="(slotProps.data as Category).path_to_top.map((item)=>{return{label:item}})"
            />
          </span>
        </template>
      </Column>
      <Column :header="columnsName[currentLang].description">
        <template #body="slotProps">
          {{ localizedContent(slotProps.data as Category).cg_description }}
        </template>
      </Column>
      <Column :header="columnsName[currentLang].img">
        <template #body="slotProps">
          <div class="img-box">
            <img
              :src="(slotProps.data as Category).category_image||noimg"
              alt="img"
            />
          </div>
        </template>
      </Column>
      <template #expansion="slotProps">
        <div class="p-4">
          <DataTable
            :value="(slotProps.data as Category).childs"
            v-model:expandedRows="expandedRowsInner"
            dataKey="id"
          >
            <Column expander style="width: 5rem" />
            <Column :header="columnsName[currentLang].name">
              <template #body="slotProps">
                {{ localizedContent(slotProps.data as Category).cg_name }}
              </template>
            </Column>
            <Column :header="columnsName[currentLang].description">
              <template #body="slotProps">
                {{
                  localizedContent(slotProps.data as Category).cg_description
                }}
              </template>
            </Column>
            <Column :header="columnsName[currentLang].img">
              <template #body="slotProps">
                <div class="img-box">
                  <img
                    :src="(slotProps.data as Category).category_image||noimg"
                    alt="img"
                  />
                </div>
              </template>
            </Column>
            <template #expansion="slotProps">
              <div class="p-4">
                <DataTable :value="(slotProps.data as Category).childs">
                  <Column style="width: 7rem" />
                  <Column :header="columnsName[currentLang].name">
                    <template #body="slotProps">
                      {{ localizedContent(slotProps.data as Category).cg_name }}
                    </template>
                  </Column>
                  <Column :header="columnsName[currentLang].description">
                    <template #body="slotProps">
                      {{
                        localizedContent(slotProps.data as Category)
                          .cg_description
                      }}
                    </template>
                  </Column>
                  <Column :header="columnsName[currentLang].img">
                    <template #body="slotProps">
                      <div class="img-box">
                        <img
                          :src="(slotProps.data as Category).category_image||noimg"
                          alt="img"
                        />
                      </div>
                    </template>
                  </Column>
                </DataTable>
              </div>
            </template>
          </DataTable>
        </div>
      </template>
    </DataTable>
    <Toast />
  </div>
</template>

<script setup lang="ts">
import data from "~/data/task_json.json";
import noimg from "~/assets/img/no-image.svg";

interface LocaleContent {
  id?: number;
  cg_name?: string;
  cg_description?: string;
  cg_title?: string;
  cg_slug?: string;
  meta_description?: string;
  meta_keywords?: string;
  link?: string;
}

interface SocialMeta {
  id: number;
  cat_id: number;
  og_property_name?: string;
  extra_meta_name?: string;
  locale: {
    en: Partial<LocaleContent>;
    ru: Partial<LocaleContent>;
    fr: Partial<LocaleContent>;
  };
}

interface Category {
  id: number;
  depth: number;
  numchild: number;
  category_image?: string | null;
  logo_image?: string | null;
  menu_image?: string | null;
  separate_menu: boolean;
  c_images: number;
  product_rep_1_id?: number | null;
  product_rep_2_id?: number | null;
  c_views: number;
  og?: SocialMeta[] | null;
  twitter?: SocialMeta[] | null;
  locale: {
    en: Partial<LocaleContent>;
    ru: Partial<LocaleContent>;
    fr: Partial<LocaleContent>;
  };
  search_target?: boolean;
  path_to_top: string[];
  childs?: Category[];
}

const columnsName = Object.freeze({
  ru: {
    name: "Имя",
    description: "Описание",
    img: "Картинка",
  },
  en: {
    name: "Name",
    description: "Description",
    img: "Image",
  },
  fr: {
    name: "Nom",
    description: "Description",
    img: "Image",
  },
});

const products = ref<Category[] | null>(null);
const expandedRows = ref({});
const expandedRowsInner = ref({});
type Lang = keyof Category["locale"];

const langs: Lang[] = ["ru", "fr", "en"];

const currentLang = ref<Lang>("ru");

const localizedContent = computed(() => {
  return (category: Category) => {
    const selectedContent = category.locale[currentLang.value];
    if (selectedContent && Object.keys(selectedContent).length > 0) {
      return selectedContent;
    }

    for (const lang of Object.keys(category.locale) as Lang[]) {
      const content = category.locale[lang];
      if (content && Object.keys(content).length > 0) {
        return content;
      }
    }

    return {};
  };
});

const handleCategoryClick = (link: string | null | undefined) => {
  if (!link) return;
  window.open(link, "_blank");
};

onMounted(() => {
  products.value = data as Category[];
});
</script>

<style scoped lang="scss">
.table {
  .plain-butt {
    cursor: pointer;
    padding: 0;
    margin: 0;
    outline: none;
    border: none;
    background-color: transparent;
    text-align: left;
  }
  .img-box {
    overflow: hidden;
    border-radius: 15px;
    width: 300px;
    height: 50px;
    img {
      object-fit: cover;
    }
  }
}
</style>
