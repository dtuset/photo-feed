<template>
  <v-container>
    <v-card id="paginator" width="100%" style="position: -webkit-sticky;position: sticky;
    top: 0px;z-index: 1;" flat>
      <div class="text-center">
        <v-pagination v-model="page" :length="pageCount"></v-pagination>
      </div>
    </v-card>
    <v-row>
      <v-col cols="12">
        <v-card>
          <v-container fluid>
            <v-row no-gutters>
              <v-col
                v-for="(image, index) in pageImages"
                :key="image.id"
                :xs="9"
                :sm="6"
                :md="4"
                :lg="3"
                :cols="12"
              >
                <v-card flat tile link class="d-flex">
                  <v-img :src="image.cropped_picture" :alt="image.id"
                    aspect-ratio="1"
                    class="grey lighten-2"
                    tile
                    @click="popImage(image.id, index)"
                  >
                    <template v-slot:placeholder>
                      <v-row
                        class="fill-height ma-0"
                        align="center"
                        justify="center"
                      >
                        <v-progress-circular indeterminate color="grey lighten-5">
                        </v-progress-circular>
                      </v-row>
                    </template>
                  </v-img>
                </v-card>
              </v-col>
            </v-row>
          </v-container>
          <Photo :pageImages=pageImages
          :modalDataArray=modalDataArray
          :dialog=dialog
          :modalData=modalData
          :id=id
          :index=index
          :nextImage=nextImage
          :prevImage=prevImage
          @update="dialog = $event;"/>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import Photo from '@/views/Photo.vue';
import appService from '@/api/app.service';
import { debounce } from 'lodash';

export default {
  name: 'Grid',
  data() {
    return {
      pageImages: [],
      modalDataArray: [],
      modalData: {},
      page: 1,
      pageCount: 0,
      hasMore: false,
      dialog: false,
      loading: false,
      id: '',
      index: 0,
    };
  },
  methods: {
    async nextImage() {
      const currIndex = this.index;
      const nextIndex = currIndex + 1;
      const nextImage = this.pageImages[nextIndex];
      const imgsPerPage = this.pageImages.length;

      if (nextIndex < imgsPerPage) {
        if (typeof this.modalDataArray[nextIndex] === 'undefined') {
          await this.getImage(nextImage.id, nextIndex);
        } else {
          this.modalData = this.modalDataArray[nextIndex];
        }
        this.index = nextIndex;
        this.id = nextImage.id;
      }
    },
    async prevImage() {
      const currIndex = this.index;
      const prevIndex = currIndex - 1;
      const nextImage = this.pageImages[prevIndex];

      if (prevIndex >= 0) {
        if (typeof this.modalDataArray[prevIndex] === 'undefined') {
          await this.getImage(nextImage.id, prevIndex);
        } else {
          this.modalData = this.modalDataArray[prevIndex];
        }
        this.index = prevIndex;
        this.id = nextImage.id;
      }
    },
    popImage(id, index) {
      this.getImage(id, index);
      this.index = index;
      this.id = id;
    },
    fillsModalDataArray(i) {
      this.modalDataArray[i] = this.modalData;
    },
    getImage(id, index) {
      this.loading = true;
      appService.get(`/images/${id}`)
        .then((data) => {
          this.modalData = data;
          this.fillsModalDataArray(index);
          this.dialog = true;
        })
        .catch(() => {
          this.loading = false;
        });
      this.loading = false;
    },
    renderImages(page) {
      this.getPageData(page);
    },
    getPageData(page) {
      this.loading = true;
      appService.get(`/images?page=${page}`)
        .then((data) => {
          this.pictures = data.pictures;
          this.pageImages = data.pictures;
          this.hasMore = data.hasMore;
          this.page = data.page;
          this.pageCount = data.pageCount;
        })
        .catch(() => {
          this.loading = false;
        });
      this.loading = false;
    },
    newPageReset() {
      this.pageImages = [];
      this.modalDataArray = [];
      this.modalData = {};
      this.hasMore = false;
      this.dialog = false;
      this.loading = false;
      this.id = '';
      this.index = 0;
    },
  },
  watch: {
    // eslint-disable-next-line
    page: debounce(function (n) {
      this.newPageReset();
      this.renderImages(n);
    }, 500),
  },
  created() {
    this.getPageData(this.page);
  },
  components: {
    Photo,
  },
};
</script>
