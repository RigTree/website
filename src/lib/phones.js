/**
 * Smartphone database 2018–2026
 * Structure: { brand, models: [{ name, year, soc, ram_gb[], storage_gb[], battery, display: { size_inch, type, refresh_rate, width, height }, camera: { front, rear[] } }] }
 */
export const PHONE_DB = [
  /* ─────────────── APPLE ─────────────── */
  { brand: 'Apple', models: [
    { name: 'iPhone XR', year: 2018, soc: 'Apple A12 Bionic', ram_gb: [3], storage_gb: [64, 128, 256], battery: 2942, display: { size_inch: 6.1, type: 'LCD', refresh_rate: 60, width: 828, height: 1792 }, camera: { front: 7, rear: [12] } },
    { name: 'iPhone XS', year: 2018, soc: 'Apple A12 Bionic', ram_gb: [4], storage_gb: [64, 256, 512], battery: 2658, display: { size_inch: 5.8, type: 'OLED', refresh_rate: 60, width: 1125, height: 2436 }, camera: { front: 7, rear: [12, 12] } },
    { name: 'iPhone XS Max', year: 2018, soc: 'Apple A12 Bionic', ram_gb: [4], storage_gb: [64, 256, 512], battery: 3174, display: { size_inch: 6.5, type: 'OLED', refresh_rate: 60, width: 1242, height: 2688 }, camera: { front: 7, rear: [12, 12] } },
    { name: 'iPhone 11', year: 2019, soc: 'Apple A13 Bionic', ram_gb: [4], storage_gb: [64, 128, 256], battery: 3110, display: { size_inch: 6.1, type: 'LCD', refresh_rate: 60, width: 828, height: 1792 }, camera: { front: 12, rear: [12, 12] } },
    { name: 'iPhone 11 Pro', year: 2019, soc: 'Apple A13 Bionic', ram_gb: [6], storage_gb: [64, 256, 512], battery: 3046, display: { size_inch: 5.8, type: 'OLED', refresh_rate: 60, width: 1125, height: 2436 }, camera: { front: 12, rear: [12, 12, 12] } },
    { name: 'iPhone 11 Pro Max', year: 2019, soc: 'Apple A13 Bionic', ram_gb: [6], storage_gb: [64, 256, 512], battery: 3969, display: { size_inch: 6.5, type: 'OLED', refresh_rate: 60, width: 1242, height: 2688 }, camera: { front: 12, rear: [12, 12, 12] } },
    { name: 'iPhone SE (2nd gen)', year: 2020, soc: 'Apple A13 Bionic', ram_gb: [3], storage_gb: [64, 128, 256], battery: 1821, display: { size_inch: 4.7, type: 'LCD', refresh_rate: 60, width: 750, height: 1334 }, camera: { front: 7, rear: [12] } },
    { name: 'iPhone 12', year: 2020, soc: 'Apple A14 Bionic', ram_gb: [4], storage_gb: [64, 128, 256], battery: 2815, display: { size_inch: 6.1, type: 'OLED', refresh_rate: 60, width: 1170, height: 2532 }, camera: { front: 12, rear: [12, 12] } },
    { name: 'iPhone 12 mini', year: 2020, soc: 'Apple A14 Bionic', ram_gb: [4], storage_gb: [64, 128, 256], battery: 2227, display: { size_inch: 5.4, type: 'OLED', refresh_rate: 60, width: 1080, height: 2340 }, camera: { front: 12, rear: [12, 12] } },
    { name: 'iPhone 12 Pro', year: 2020, soc: 'Apple A14 Bionic', ram_gb: [6], storage_gb: [128, 256, 512], battery: 2815, display: { size_inch: 6.1, type: 'OLED', refresh_rate: 60, width: 1170, height: 2532 }, camera: { front: 12, rear: [12, 12, 12] } },
    { name: 'iPhone 12 Pro Max', year: 2020, soc: 'Apple A14 Bionic', ram_gb: [6], storage_gb: [128, 256, 512], battery: 3687, display: { size_inch: 6.7, type: 'OLED', refresh_rate: 60, width: 1284, height: 2778 }, camera: { front: 12, rear: [12, 12, 12] } },
    { name: 'iPhone 13', year: 2021, soc: 'Apple A15 Bionic', ram_gb: [4], storage_gb: [128, 256, 512], battery: 3227, display: { size_inch: 6.1, type: 'OLED', refresh_rate: 60, width: 1170, height: 2532 }, camera: { front: 12, rear: [12, 12] } },
    { name: 'iPhone 13 mini', year: 2021, soc: 'Apple A15 Bionic', ram_gb: [4], storage_gb: [128, 256, 512], battery: 2438, display: { size_inch: 5.4, type: 'OLED', refresh_rate: 60, width: 1080, height: 2340 }, camera: { front: 12, rear: [12, 12] } },
    { name: 'iPhone 13 Pro', year: 2021, soc: 'Apple A15 Bionic', ram_gb: [6], storage_gb: [128, 256, 512, 1024], battery: 3095, display: { size_inch: 6.1, type: 'OLED', refresh_rate: 120, width: 1170, height: 2532 }, camera: { front: 12, rear: [12, 12, 12] } },
    { name: 'iPhone 13 Pro Max', year: 2021, soc: 'Apple A15 Bionic', ram_gb: [6], storage_gb: [128, 256, 512, 1024], battery: 4352, display: { size_inch: 6.7, type: 'OLED', refresh_rate: 120, width: 1284, height: 2778 }, camera: { front: 12, rear: [12, 12, 12] } },
    { name: 'iPhone SE (3rd gen)', year: 2022, soc: 'Apple A15 Bionic', ram_gb: [4], storage_gb: [64, 128, 256], battery: 2018, display: { size_inch: 4.7, type: 'LCD', refresh_rate: 60, width: 750, height: 1334 }, camera: { front: 7, rear: [12] } },
    { name: 'iPhone 14', year: 2022, soc: 'Apple A15 Bionic', ram_gb: [6], storage_gb: [128, 256, 512], battery: 3279, display: { size_inch: 6.1, type: 'OLED', refresh_rate: 60, width: 1170, height: 2532 }, camera: { front: 12, rear: [12, 12] } },
    { name: 'iPhone 14 Plus', year: 2022, soc: 'Apple A15 Bionic', ram_gb: [6], storage_gb: [128, 256, 512], battery: 4325, display: { size_inch: 6.7, type: 'OLED', refresh_rate: 60, width: 1284, height: 2778 }, camera: { front: 12, rear: [12, 12] } },
    { name: 'iPhone 14 Pro', year: 2022, soc: 'Apple A16 Bionic', ram_gb: [6], storage_gb: [128, 256, 512, 1024], battery: 3200, display: { size_inch: 6.1, type: 'OLED', refresh_rate: 120, width: 1179, height: 2556 }, camera: { front: 12, rear: [48, 12, 12] } },
    { name: 'iPhone 14 Pro Max', year: 2022, soc: 'Apple A16 Bionic', ram_gb: [6], storage_gb: [128, 256, 512, 1024], battery: 4323, display: { size_inch: 6.7, type: 'OLED', refresh_rate: 120, width: 1290, height: 2796 }, camera: { front: 12, rear: [48, 12, 12] } },
    { name: 'iPhone 15', year: 2023, soc: 'Apple A16 Bionic', ram_gb: [6], storage_gb: [128, 256, 512], battery: 3349, display: { size_inch: 6.1, type: 'OLED', refresh_rate: 60, width: 1179, height: 2556 }, camera: { front: 12, rear: [48, 12] } },
    { name: 'iPhone 15 Plus', year: 2023, soc: 'Apple A16 Bionic', ram_gb: [6], storage_gb: [128, 256, 512], battery: 4383, display: { size_inch: 6.7, type: 'OLED', refresh_rate: 60, width: 1290, height: 2796 }, camera: { front: 12, rear: [48, 12] } },
    { name: 'iPhone 15 Pro', year: 2023, soc: 'Apple A17 Pro', ram_gb: [8], storage_gb: [128, 256, 512, 1024], battery: 3274, display: { size_inch: 6.1, type: 'OLED', refresh_rate: 120, width: 1179, height: 2556 }, camera: { front: 12, rear: [48, 12, 12] } },
    { name: 'iPhone 15 Pro Max', year: 2023, soc: 'Apple A17 Pro', ram_gb: [8], storage_gb: [256, 512, 1024], battery: 4422, display: { size_inch: 6.7, type: 'OLED', refresh_rate: 120, width: 1290, height: 2796 }, camera: { front: 12, rear: [48, 12, 12] } },
    { name: 'iPhone 16', year: 2024, soc: 'Apple A18', ram_gb: [8], storage_gb: [128, 256, 512], battery: 3561, display: { size_inch: 6.1, type: 'OLED', refresh_rate: 60, width: 1179, height: 2556 }, camera: { front: 12, rear: [48, 12] } },
    { name: 'iPhone 16 Plus', year: 2024, soc: 'Apple A18', ram_gb: [8], storage_gb: [128, 256, 512], battery: 4674, display: { size_inch: 6.7, type: 'OLED', refresh_rate: 60, width: 1290, height: 2796 }, camera: { front: 12, rear: [48, 12] } },
    { name: 'iPhone 16 Pro', year: 2024, soc: 'Apple A18 Pro', ram_gb: [8], storage_gb: [128, 256, 512, 1024], battery: 3582, display: { size_inch: 6.3, type: 'OLED', refresh_rate: 120, width: 1206, height: 2622 }, camera: { front: 12, rear: [48, 12, 12] } },
    { name: 'iPhone 16 Pro Max', year: 2024, soc: 'Apple A18 Pro', ram_gb: [8], storage_gb: [256, 512, 1024], battery: 4685, display: { size_inch: 6.9, type: 'OLED', refresh_rate: 120, width: 1320, height: 2868 }, camera: { front: 12, rear: [48, 12, 12] } },
    { name: 'iPhone 16e', year: 2025, soc: 'Apple A16 Bionic', ram_gb: [8], storage_gb: [128, 256, 512], battery: 3279, display: { size_inch: 6.1, type: 'OLED', refresh_rate: 60, width: 1170, height: 2532 }, camera: { front: 12, rear: [48] } },
  ]},

  /* ─────────────── SAMSUNG ─────────────── */
  { brand: 'Samsung', models: [
    { name: 'Galaxy S9', year: 2018, soc: 'Snapdragon 845 / Exynos 9810', ram_gb: [4], storage_gb: [64, 128, 256], battery: 3000, display: { size_inch: 5.8, type: 'AMOLED', refresh_rate: 60, width: 1440, height: 2960 }, camera: { front: 8, rear: [12] } },
    { name: 'Galaxy S9+', year: 2018, soc: 'Snapdragon 845 / Exynos 9810', ram_gb: [6], storage_gb: [64, 128, 256], battery: 3500, display: { size_inch: 6.2, type: 'AMOLED', refresh_rate: 60, width: 1440, height: 2960 }, camera: { front: 8, rear: [12, 12] } },
    { name: 'Galaxy Note 9', year: 2018, soc: 'Snapdragon 845 / Exynos 9810', ram_gb: [6, 8], storage_gb: [128, 512], battery: 4000, display: { size_inch: 6.4, type: 'AMOLED', refresh_rate: 60, width: 1440, height: 2960 }, camera: { front: 8, rear: [12, 12] } },
    { name: 'Galaxy A50', year: 2019, soc: 'Exynos 9610', ram_gb: [4, 6], storage_gb: [64, 128], battery: 4000, display: { size_inch: 6.4, type: 'AMOLED', refresh_rate: 60, width: 1080, height: 2340 }, camera: { front: 25, rear: [25, 5, 8] } },
    { name: 'Galaxy S10e', year: 2019, soc: 'Snapdragon 855 / Exynos 9820', ram_gb: [6], storage_gb: [128, 256], battery: 3100, display: { size_inch: 5.8, type: 'AMOLED', refresh_rate: 60, width: 1080, height: 2280 }, camera: { front: 10, rear: [12, 16] } },
    { name: 'Galaxy S10', year: 2019, soc: 'Snapdragon 855 / Exynos 9820', ram_gb: [8], storage_gb: [128, 512], battery: 3400, display: { size_inch: 6.1, type: 'AMOLED', refresh_rate: 60, width: 1440, height: 3040 }, camera: { front: 10, rear: [12, 12, 16] } },
    { name: 'Galaxy S10+', year: 2019, soc: 'Snapdragon 855 / Exynos 9820', ram_gb: [8, 12], storage_gb: [128, 512, 1024], battery: 4100, display: { size_inch: 6.4, type: 'AMOLED', refresh_rate: 60, width: 1440, height: 3040 }, camera: { front: 10, rear: [12, 12, 16] } },
    { name: 'Galaxy Note 10', year: 2019, soc: 'Snapdragon 855 / Exynos 9825', ram_gb: [8], storage_gb: [256], battery: 3500, display: { size_inch: 6.3, type: 'AMOLED', refresh_rate: 60, width: 1080, height: 2280 }, camera: { front: 10, rear: [12, 12, 16] } },
    { name: 'Galaxy Note 10+', year: 2019, soc: 'Snapdragon 855 / Exynos 9825', ram_gb: [12], storage_gb: [256, 512], battery: 4300, display: { size_inch: 6.8, type: 'AMOLED', refresh_rate: 60, width: 1440, height: 3040 }, camera: { front: 10, rear: [12, 12, 16] } },
    { name: 'Galaxy S20', year: 2020, soc: 'Snapdragon 865 / Exynos 990', ram_gb: [8, 12], storage_gb: [128], battery: 4000, display: { size_inch: 6.2, type: 'AMOLED', refresh_rate: 120, width: 1080, height: 2400 }, camera: { front: 10, rear: [12, 12, 64] } },
    { name: 'Galaxy S20+', year: 2020, soc: 'Snapdragon 865 / Exynos 990', ram_gb: [8, 12], storage_gb: [128], battery: 4500, display: { size_inch: 6.7, type: 'AMOLED', refresh_rate: 120, width: 1440, height: 3200 }, camera: { front: 10, rear: [12, 12, 64] } },
    { name: 'Galaxy S20 Ultra', year: 2020, soc: 'Snapdragon 865 / Exynos 990', ram_gb: [12, 16], storage_gb: [128, 256, 512], battery: 5000, display: { size_inch: 6.9, type: 'AMOLED', refresh_rate: 120, width: 1440, height: 3200 }, camera: { front: 40, rear: [108, 12, 48] } },
    { name: 'Galaxy A51', year: 2020, soc: 'Exynos 9611', ram_gb: [4, 6, 8], storage_gb: [64, 128], battery: 4000, display: { size_inch: 6.5, type: 'AMOLED', refresh_rate: 60, width: 1080, height: 2400 }, camera: { front: 32, rear: [48, 12, 5, 5] } },
    { name: 'Galaxy Note 20', year: 2020, soc: 'Snapdragon 865+ / Exynos 990', ram_gb: [8], storage_gb: [256], battery: 4300, display: { size_inch: 6.7, type: 'AMOLED', refresh_rate: 60, width: 1080, height: 2400 }, camera: { front: 10, rear: [12, 12, 64] } },
    { name: 'Galaxy Note 20 Ultra', year: 2020, soc: 'Snapdragon 865+ / Exynos 990', ram_gb: [12], storage_gb: [128, 256, 512], battery: 4500, display: { size_inch: 6.9, type: 'AMOLED', refresh_rate: 120, width: 1440, height: 3088 }, camera: { front: 10, rear: [108, 12, 12] } },
    { name: 'Galaxy S21', year: 2021, soc: 'Snapdragon 888 / Exynos 2100', ram_gb: [8], storage_gb: [128, 256], battery: 4000, display: { size_inch: 6.2, type: 'AMOLED', refresh_rate: 120, width: 1080, height: 2400 }, camera: { front: 10, rear: [12, 12, 64] } },
    { name: 'Galaxy S21+', year: 2021, soc: 'Snapdragon 888 / Exynos 2100', ram_gb: [8], storage_gb: [128, 256], battery: 4800, display: { size_inch: 6.7, type: 'AMOLED', refresh_rate: 120, width: 1080, height: 2400 }, camera: { front: 10, rear: [12, 12, 64] } },
    { name: 'Galaxy S21 Ultra', year: 2021, soc: 'Snapdragon 888 / Exynos 2100', ram_gb: [12, 16], storage_gb: [128, 256, 512], battery: 5000, display: { size_inch: 6.8, type: 'AMOLED', refresh_rate: 120, width: 1440, height: 3200 }, camera: { front: 40, rear: [108, 10, 10, 12] } },
    { name: 'Galaxy A52', year: 2021, soc: 'Snapdragon 720G', ram_gb: [4, 6, 8], storage_gb: [128, 256], battery: 4500, display: { size_inch: 6.5, type: 'AMOLED', refresh_rate: 90, width: 1080, height: 2400 }, camera: { front: 32, rear: [64, 12, 5, 5] } },
    { name: 'Galaxy Z Fold 3', year: 2021, soc: 'Snapdragon 888', ram_gb: [12], storage_gb: [256, 512], battery: 4400, display: { size_inch: 7.6, type: 'AMOLED', refresh_rate: 120, width: 1768, height: 2208 }, camera: { front: 10, rear: [12, 12, 12] } },
    { name: 'Galaxy Z Flip 3', year: 2021, soc: 'Snapdragon 888', ram_gb: [8], storage_gb: [128, 256], battery: 3300, display: { size_inch: 6.7, type: 'AMOLED', refresh_rate: 120, width: 1080, height: 2640 }, camera: { front: 10, rear: [12, 12] } },
    { name: 'Galaxy S22', year: 2022, soc: 'Snapdragon 8 Gen 1 / Exynos 2200', ram_gb: [8], storage_gb: [128, 256], battery: 3700, display: { size_inch: 6.1, type: 'AMOLED', refresh_rate: 120, width: 1080, height: 2340 }, camera: { front: 10, rear: [50, 10, 12] } },
    { name: 'Galaxy S22+', year: 2022, soc: 'Snapdragon 8 Gen 1 / Exynos 2200', ram_gb: [8], storage_gb: [128, 256], battery: 4500, display: { size_inch: 6.6, type: 'AMOLED', refresh_rate: 120, width: 1080, height: 2340 }, camera: { front: 10, rear: [50, 10, 12] } },
    { name: 'Galaxy S22 Ultra', year: 2022, soc: 'Snapdragon 8 Gen 1 / Exynos 2200', ram_gb: [8, 12], storage_gb: [128, 256, 512, 1024], battery: 5000, display: { size_inch: 6.8, type: 'AMOLED', refresh_rate: 120, width: 1440, height: 3088 }, camera: { front: 40, rear: [108, 10, 10, 12] } },
    { name: 'Galaxy A53 5G', year: 2022, soc: 'Exynos 1280', ram_gb: [6, 8], storage_gb: [128, 256], battery: 5000, display: { size_inch: 6.5, type: 'AMOLED', refresh_rate: 120, width: 1080, height: 2400 }, camera: { front: 32, rear: [64, 12, 5, 5] } },
    { name: 'Galaxy Z Fold 4', year: 2022, soc: 'Snapdragon 8+ Gen 1', ram_gb: [12], storage_gb: [256, 512, 1024], battery: 4400, display: { size_inch: 7.6, type: 'AMOLED', refresh_rate: 120, width: 1812, height: 2176 }, camera: { front: 10, rear: [50, 10, 12] } },
    { name: 'Galaxy Z Flip 4', year: 2022, soc: 'Snapdragon 8+ Gen 1', ram_gb: [8], storage_gb: [128, 256, 512], battery: 3700, display: { size_inch: 6.7, type: 'AMOLED', refresh_rate: 120, width: 1080, height: 2640 }, camera: { front: 10, rear: [12, 12] } },
    { name: 'Galaxy S23', year: 2023, soc: 'Snapdragon 8 Gen 2', ram_gb: [8], storage_gb: [128, 256], battery: 3900, display: { size_inch: 6.1, type: 'AMOLED', refresh_rate: 120, width: 1080, height: 2340 }, camera: { front: 12, rear: [50, 10, 12] } },
    { name: 'Galaxy S23+', year: 2023, soc: 'Snapdragon 8 Gen 2', ram_gb: [8], storage_gb: [256, 512], battery: 4700, display: { size_inch: 6.6, type: 'AMOLED', refresh_rate: 120, width: 1080, height: 2340 }, camera: { front: 12, rear: [50, 10, 12] } },
    { name: 'Galaxy S23 Ultra', year: 2023, soc: 'Snapdragon 8 Gen 2', ram_gb: [8, 12], storage_gb: [256, 512, 1024], battery: 5000, display: { size_inch: 6.8, type: 'AMOLED', refresh_rate: 120, width: 1440, height: 3088 }, camera: { front: 12, rear: [200, 10, 10, 12] } },
    { name: 'Galaxy A54 5G', year: 2023, soc: 'Exynos 1380', ram_gb: [6, 8], storage_gb: [128, 256], battery: 5000, display: { size_inch: 6.4, type: 'AMOLED', refresh_rate: 120, width: 1080, height: 2340 }, camera: { front: 32, rear: [50, 12, 5] } },
    { name: 'Galaxy Z Fold 5', year: 2023, soc: 'Snapdragon 8 Gen 2', ram_gb: [12], storage_gb: [256, 512, 1024], battery: 4400, display: { size_inch: 7.6, type: 'AMOLED', refresh_rate: 120, width: 1812, height: 2176 }, camera: { front: 10, rear: [50, 10, 12] } },
    { name: 'Galaxy Z Flip 5', year: 2023, soc: 'Snapdragon 8 Gen 2', ram_gb: [8], storage_gb: [256, 512], battery: 3700, display: { size_inch: 6.7, type: 'AMOLED', refresh_rate: 120, width: 1080, height: 2640 }, camera: { front: 10, rear: [12, 12] } },
    { name: 'Galaxy S24', year: 2024, soc: 'Snapdragon 8 Gen 3 / Exynos 2400', ram_gb: [8], storage_gb: [128, 256], battery: 4000, display: { size_inch: 6.2, type: 'AMOLED', refresh_rate: 120, width: 1080, height: 2340 }, camera: { front: 12, rear: [50, 10, 12] } },
    { name: 'Galaxy S24+', year: 2024, soc: 'Snapdragon 8 Gen 3 / Exynos 2400', ram_gb: [12], storage_gb: [256, 512], battery: 4900, display: { size_inch: 6.7, type: 'AMOLED', refresh_rate: 120, width: 1440, height: 3088 }, camera: { front: 12, rear: [50, 10, 12] } },
    { name: 'Galaxy S24 Ultra', year: 2024, soc: 'Snapdragon 8 Gen 3', ram_gb: [12], storage_gb: [256, 512, 1024], battery: 5000, display: { size_inch: 6.8, type: 'AMOLED', refresh_rate: 120, width: 1440, height: 3088 }, camera: { front: 12, rear: [200, 10, 10, 50] } },
    { name: 'Galaxy S24 FE', year: 2024, soc: 'Exynos 2500', ram_gb: [8], storage_gb: [128, 256], battery: 4700, display: { size_inch: 6.7, type: 'AMOLED', refresh_rate: 120, width: 1080, height: 2340 }, camera: { front: 10, rear: [50, 8, 10] } },
    { name: 'Galaxy Z Fold 6', year: 2024, soc: 'Snapdragon 8 Gen 3', ram_gb: [12], storage_gb: [256, 512, 1024], battery: 4400, display: { size_inch: 7.6, type: 'AMOLED', refresh_rate: 120, width: 1856, height: 2160 }, camera: { front: 10, rear: [50, 10, 12] } },
    { name: 'Galaxy Z Flip 6', year: 2024, soc: 'Snapdragon 8 Gen 3', ram_gb: [12], storage_gb: [256, 512], battery: 4000, display: { size_inch: 6.7, type: 'AMOLED', refresh_rate: 120, width: 1080, height: 2640 }, camera: { front: 10, rear: [50, 12] } },
    { name: 'Galaxy S25', year: 2025, soc: 'Snapdragon 8 Elite', ram_gb: [12], storage_gb: [128, 256, 512], battery: 4000, display: { size_inch: 6.2, type: 'AMOLED', refresh_rate: 120, width: 1080, height: 2340 }, camera: { front: 12, rear: [50, 10, 12] } },
    { name: 'Galaxy S25+', year: 2025, soc: 'Snapdragon 8 Elite', ram_gb: [12], storage_gb: [256, 512], battery: 4900, display: { size_inch: 6.7, type: 'AMOLED', refresh_rate: 120, width: 1440, height: 3088 }, camera: { front: 12, rear: [50, 10, 12] } },
    { name: 'Galaxy S25 Ultra', year: 2025, soc: 'Snapdragon 8 Elite', ram_gb: [12], storage_gb: [256, 512, 1024], battery: 5000, display: { size_inch: 6.9, type: 'AMOLED', refresh_rate: 120, width: 1440, height: 3120 }, camera: { front: 12, rear: [200, 10, 50, 50] } },
    { name: 'Galaxy S25 Edge', year: 2025, soc: 'Snapdragon 8 Elite', ram_gb: [12], storage_gb: [256, 512], battery: 3900, display: { size_inch: 6.7, type: 'AMOLED', refresh_rate: 120, width: 1080, height: 2340 }, camera: { front: 12, rear: [200, 12] } },
    { name: 'Galaxy Z Fold 7', year: 2025, soc: 'Snapdragon 8 Elite', ram_gb: [12], storage_gb: [256, 512, 1024], battery: 4400, display: { size_inch: 7.9, type: 'AMOLED', refresh_rate: 120, width: 1856, height: 2288 }, camera: { front: 10, rear: [200, 10, 10] } },
    { name: 'Galaxy Z Flip 7', year: 2025, soc: 'Snapdragon 8 Elite', ram_gb: [12], storage_gb: [256, 512], battery: 4300, display: { size_inch: 6.7, type: 'AMOLED', refresh_rate: 120, width: 1080, height: 2640 }, camera: { front: 10, rear: [50, 12] } },
  ]},

  /* ─────────────── GOOGLE ─────────────── */
  { brand: 'Google', models: [
    { name: 'Pixel 2', year: 2018, soc: 'Snapdragon 835', ram_gb: [4], storage_gb: [64, 128], battery: 2700, display: { size_inch: 5.0, type: 'AMOLED', refresh_rate: 60, width: 1080, height: 1920 }, camera: { front: 8, rear: [12] } },
    { name: 'Pixel 2 XL', year: 2018, soc: 'Snapdragon 835', ram_gb: [4], storage_gb: [64, 128], battery: 3520, display: { size_inch: 6.0, type: 'AMOLED', refresh_rate: 60, width: 1440, height: 2880 }, camera: { front: 8, rear: [12] } },
    { name: 'Pixel 3', year: 2018, soc: 'Snapdragon 845', ram_gb: [4], storage_gb: [64, 128], battery: 2915, display: { size_inch: 5.5, type: 'AMOLED', refresh_rate: 60, width: 1080, height: 2160 }, camera: { front: 8, rear: [12] } },
    { name: 'Pixel 3 XL', year: 2018, soc: 'Snapdragon 845', ram_gb: [4], storage_gb: [64, 128], battery: 3430, display: { size_inch: 6.3, type: 'AMOLED', refresh_rate: 60, width: 1440, height: 2960 }, camera: { front: 8, rear: [12] } },
    { name: 'Pixel 3a', year: 2019, soc: 'Snapdragon 670', ram_gb: [4], storage_gb: [64], battery: 3000, display: { size_inch: 5.6, type: 'AMOLED', refresh_rate: 60, width: 1080, height: 2220 }, camera: { front: 8, rear: [12] } },
    { name: 'Pixel 3a XL', year: 2019, soc: 'Snapdragon 670', ram_gb: [4], storage_gb: [64], battery: 3700, display: { size_inch: 6.0, type: 'AMOLED', refresh_rate: 60, width: 1080, height: 2160 }, camera: { front: 8, rear: [12] } },
    { name: 'Pixel 4', year: 2019, soc: 'Snapdragon 855', ram_gb: [6], storage_gb: [64, 128], battery: 2800, display: { size_inch: 5.7, type: 'AMOLED', refresh_rate: 90, width: 1080, height: 2280 }, camera: { front: 8, rear: [12, 16] } },
    { name: 'Pixel 4 XL', year: 2019, soc: 'Snapdragon 855', ram_gb: [6], storage_gb: [64, 128], battery: 3700, display: { size_inch: 6.3, type: 'AMOLED', refresh_rate: 90, width: 1440, height: 3040 }, camera: { front: 8, rear: [12, 16] } },
    { name: 'Pixel 4a', year: 2020, soc: 'Snapdragon 730G', ram_gb: [6], storage_gb: [128], battery: 3140, display: { size_inch: 5.81, type: 'AMOLED', refresh_rate: 60, width: 1080, height: 2340 }, camera: { front: 8, rear: [12] } },
    { name: 'Pixel 5', year: 2020, soc: 'Snapdragon 765G', ram_gb: [8], storage_gb: [128], battery: 4080, display: { size_inch: 6.0, type: 'AMOLED', refresh_rate: 90, width: 1080, height: 2340 }, camera: { front: 8, rear: [12, 16] } },
    { name: 'Pixel 5a', year: 2021, soc: 'Snapdragon 765G', ram_gb: [6], storage_gb: [128], battery: 4680, display: { size_inch: 6.34, type: 'AMOLED', refresh_rate: 60, width: 1080, height: 2400 }, camera: { front: 8, rear: [12, 16] } },
    { name: 'Pixel 6', year: 2021, soc: 'Google Tensor', ram_gb: [8], storage_gb: [128, 256], battery: 4614, display: { size_inch: 6.4, type: 'AMOLED', refresh_rate: 90, width: 1080, height: 2400 }, camera: { front: 8, rear: [50, 12] } },
    { name: 'Pixel 6 Pro', year: 2021, soc: 'Google Tensor', ram_gb: [12], storage_gb: [128, 256, 512], battery: 5003, display: { size_inch: 6.71, type: 'AMOLED', refresh_rate: 120, width: 1440, height: 3120 }, camera: { front: 11, rear: [50, 12, 48] } },
    { name: 'Pixel 6a', year: 2022, soc: 'Google Tensor', ram_gb: [6], storage_gb: [128], battery: 4410, display: { size_inch: 6.1, type: 'AMOLED', refresh_rate: 60, width: 1080, height: 2400 }, camera: { front: 8, rear: [12, 12] } },
    { name: 'Pixel 7', year: 2022, soc: 'Google Tensor G2', ram_gb: [8], storage_gb: [128, 256], battery: 4355, display: { size_inch: 6.3, type: 'AMOLED', refresh_rate: 90, width: 1080, height: 2400 }, camera: { front: 10, rear: [50, 12] } },
    { name: 'Pixel 7 Pro', year: 2022, soc: 'Google Tensor G2', ram_gb: [12], storage_gb: [128, 256, 512], battery: 5000, display: { size_inch: 6.7, type: 'AMOLED', refresh_rate: 120, width: 1440, height: 3120 }, camera: { front: 10, rear: [50, 12, 48] } },
    { name: 'Pixel 7a', year: 2023, soc: 'Google Tensor G2', ram_gb: [8], storage_gb: [128], battery: 4385, display: { size_inch: 6.1, type: 'AMOLED', refresh_rate: 90, width: 1080, height: 2400 }, camera: { front: 13, rear: [64, 13] } },
    { name: 'Pixel Fold', year: 2023, soc: 'Google Tensor G2', ram_gb: [12], storage_gb: [256, 512], battery: 4821, display: { size_inch: 7.6, type: 'AMOLED', refresh_rate: 120, width: 1840, height: 2208 }, camera: { front: 8, rear: [48, 10, 10] } },
    { name: 'Pixel 8', year: 2023, soc: 'Google Tensor G3', ram_gb: [8], storage_gb: [128, 256], battery: 4575, display: { size_inch: 6.2, type: 'AMOLED', refresh_rate: 120, width: 1080, height: 2400 }, camera: { front: 10, rear: [50, 12] } },
    { name: 'Pixel 8 Pro', year: 2023, soc: 'Google Tensor G3', ram_gb: [12], storage_gb: [128, 256, 512, 1024], battery: 5050, display: { size_inch: 6.7, type: 'AMOLED', refresh_rate: 120, width: 1344, height: 2992 }, camera: { front: 10, rear: [50, 12, 48] } },
    { name: 'Pixel 8a', year: 2024, soc: 'Google Tensor G3', ram_gb: [8], storage_gb: [128, 256], battery: 4492, display: { size_inch: 6.1, type: 'AMOLED', refresh_rate: 120, width: 1080, height: 2400 }, camera: { front: 13, rear: [64, 13] } },
    { name: 'Pixel 9', year: 2024, soc: 'Google Tensor G4', ram_gb: [12], storage_gb: [128, 256], battery: 4700, display: { size_inch: 6.3, type: 'AMOLED', refresh_rate: 120, width: 1080, height: 2424 }, camera: { front: 10, rear: [50, 48] } },
    { name: 'Pixel 9 Pro', year: 2024, soc: 'Google Tensor G4', ram_gb: [16], storage_gb: [128, 256, 512, 1024], battery: 4700, display: { size_inch: 6.3, type: 'AMOLED', refresh_rate: 120, width: 1280, height: 2856 }, camera: { front: 42, rear: [50, 48, 48] } },
    { name: 'Pixel 9 Pro XL', year: 2024, soc: 'Google Tensor G4', ram_gb: [16], storage_gb: [128, 256, 512, 1024], battery: 5060, display: { size_inch: 6.8, type: 'AMOLED', refresh_rate: 120, width: 1344, height: 2992 }, camera: { front: 42, rear: [50, 48, 48] } },
    { name: 'Pixel 9 Pro Fold', year: 2024, soc: 'Google Tensor G4', ram_gb: [16], storage_gb: [256, 512], battery: 4650, display: { size_inch: 8.0, type: 'AMOLED', refresh_rate: 120, width: 2076, height: 2152 }, camera: { front: 10, rear: [48, 10, 10] } },
  ]},

  /* ─────────────── ONEPLUS ─────────────── */
  { brand: 'OnePlus', models: [
    { name: 'OnePlus 6', year: 2018, soc: 'Snapdragon 845', ram_gb: [6, 8], storage_gb: [64, 128, 256], battery: 3300, display: { size_inch: 6.28, type: 'AMOLED', refresh_rate: 60, width: 1080, height: 2280 }, camera: { front: 16, rear: [16, 20] } },
    { name: 'OnePlus 6T', year: 2018, soc: 'Snapdragon 845', ram_gb: [6, 8], storage_gb: [128, 256], battery: 3700, display: { size_inch: 6.41, type: 'AMOLED', refresh_rate: 60, width: 1080, height: 2340 }, camera: { front: 16, rear: [16, 20] } },
    { name: 'OnePlus 7', year: 2019, soc: 'Snapdragon 855', ram_gb: [6, 8, 12], storage_gb: [128, 256], battery: 3700, display: { size_inch: 6.41, type: 'AMOLED', refresh_rate: 60, width: 1080, height: 2340 }, camera: { front: 16, rear: [48, 5] } },
    { name: 'OnePlus 7 Pro', year: 2019, soc: 'Snapdragon 855', ram_gb: [6, 8, 12], storage_gb: [128, 256], battery: 4000, display: { size_inch: 6.67, type: 'AMOLED', refresh_rate: 90, width: 1440, height: 3120 }, camera: { front: 16, rear: [48, 8, 16] } },
    { name: 'OnePlus 7T', year: 2019, soc: 'Snapdragon 855+', ram_gb: [8], storage_gb: [128, 256], battery: 3800, display: { size_inch: 6.55, type: 'AMOLED', refresh_rate: 90, width: 1080, height: 2400 }, camera: { front: 16, rear: [48, 12, 16] } },
    { name: 'OnePlus 8', year: 2020, soc: 'Snapdragon 865', ram_gb: [8, 12], storage_gb: [128, 256], battery: 4300, display: { size_inch: 6.55, type: 'AMOLED', refresh_rate: 90, width: 1080, height: 2400 }, camera: { front: 16, rear: [48, 2, 16] } },
    { name: 'OnePlus 8 Pro', year: 2020, soc: 'Snapdragon 865', ram_gb: [8, 12], storage_gb: [128, 256], battery: 4510, display: { size_inch: 6.78, type: 'AMOLED', refresh_rate: 120, width: 1440, height: 3168 }, camera: { front: 16, rear: [48, 8, 48, 5] } },
    { name: 'OnePlus 8T', year: 2020, soc: 'Snapdragon 865', ram_gb: [8, 12], storage_gb: [128, 256], battery: 4500, display: { size_inch: 6.55, type: 'AMOLED', refresh_rate: 120, width: 1080, height: 2400 }, camera: { front: 16, rear: [48, 16, 5, 2] } },
    { name: 'OnePlus 9', year: 2021, soc: 'Snapdragon 888', ram_gb: [8, 12], storage_gb: [128, 256], battery: 4500, display: { size_inch: 6.55, type: 'AMOLED', refresh_rate: 120, width: 1080, height: 2400 }, camera: { front: 16, rear: [48, 50, 2] } },
    { name: 'OnePlus 9 Pro', year: 2021, soc: 'Snapdragon 888', ram_gb: [8, 12], storage_gb: [128, 256], battery: 4500, display: { size_inch: 6.7, type: 'AMOLED', refresh_rate: 120, width: 1440, height: 3216 }, camera: { front: 16, rear: [48, 50, 8, 2] } },
    { name: 'OnePlus 10 Pro', year: 2022, soc: 'Snapdragon 8 Gen 1', ram_gb: [8, 12], storage_gb: [128, 256], battery: 5000, display: { size_inch: 6.7, type: 'AMOLED', refresh_rate: 120, width: 1440, height: 3216 }, camera: { front: 32, rear: [48, 50, 8] } },
    { name: 'OnePlus 10T', year: 2022, soc: 'Snapdragon 8+ Gen 1', ram_gb: [8, 12, 16], storage_gb: [128, 256], battery: 4800, display: { size_inch: 6.7, type: 'AMOLED', refresh_rate: 120, width: 1080, height: 2412 }, camera: { front: 16, rear: [50, 8, 2] } },
    { name: 'OnePlus 11', year: 2023, soc: 'Snapdragon 8 Gen 2', ram_gb: [8, 16], storage_gb: [128, 256], battery: 5000, display: { size_inch: 6.7, type: 'AMOLED', refresh_rate: 120, width: 1440, height: 3216 }, camera: { front: 16, rear: [50, 48, 32] } },
    { name: 'OnePlus 12', year: 2024, soc: 'Snapdragon 8 Gen 3', ram_gb: [12, 16], storage_gb: [256, 512], battery: 5400, display: { size_inch: 6.82, type: 'AMOLED', refresh_rate: 120, width: 1440, height: 3168 }, camera: { front: 32, rear: [50, 64, 48] } },
    { name: 'OnePlus 13', year: 2025, soc: 'Snapdragon 8 Elite', ram_gb: [12, 16], storage_gb: [256, 512], battery: 6000, display: { size_inch: 6.82, type: 'AMOLED', refresh_rate: 120, width: 1440, height: 3168 }, camera: { front: 32, rear: [50, 50, 50] } },
  ]},

  /* ─────────────── XIAOMI / POCO / REDMI ─────────────── */
  { brand: 'Xiaomi', models: [
    { name: 'Mi 8', year: 2018, soc: 'Snapdragon 845', ram_gb: [6], storage_gb: [64, 128], battery: 3400, display: { size_inch: 6.21, type: 'AMOLED', refresh_rate: 60, width: 1080, height: 2248 }, camera: { front: 20, rear: [12, 12] } },
    { name: 'Mi 9', year: 2019, soc: 'Snapdragon 855', ram_gb: [6, 8, 12], storage_gb: [64, 128, 256], battery: 3300, display: { size_inch: 6.39, type: 'AMOLED', refresh_rate: 60, width: 1080, height: 2340 }, camera: { front: 20, rear: [48, 12, 16] } },
    { name: 'Mi 10', year: 2020, soc: 'Snapdragon 865', ram_gb: [8], storage_gb: [128, 256], battery: 4780, display: { size_inch: 6.67, type: 'AMOLED', refresh_rate: 90, width: 1080, height: 2340 }, camera: { front: 20, rear: [108, 13, 2, 2] } },
    { name: 'Mi 10 Pro', year: 2020, soc: 'Snapdragon 865', ram_gb: [8, 12], storage_gb: [256, 512], battery: 4500, display: { size_inch: 6.67, type: 'AMOLED', refresh_rate: 90, width: 1080, height: 2340 }, camera: { front: 20, rear: [108, 20, 12, 8] } },
    { name: 'Mi 11', year: 2021, soc: 'Snapdragon 888', ram_gb: [8, 12], storage_gb: [128, 256], battery: 4600, display: { size_inch: 6.81, type: 'AMOLED', refresh_rate: 120, width: 1440, height: 3200 }, camera: { front: 20, rear: [108, 13, 5] } },
    { name: 'Mi 11 Ultra', year: 2021, soc: 'Snapdragon 888', ram_gb: [12], storage_gb: [256], battery: 5000, display: { size_inch: 6.81, type: 'AMOLED', refresh_rate: 120, width: 1440, height: 3200 }, camera: { front: 20, rear: [50, 48, 48] } },
    { name: 'Xiaomi 12', year: 2022, soc: 'Snapdragon 8 Gen 1', ram_gb: [8, 12], storage_gb: [128, 256], battery: 4500, display: { size_inch: 6.28, type: 'AMOLED', refresh_rate: 120, width: 1080, height: 2400 }, camera: { front: 32, rear: [50, 13, 5] } },
    { name: 'Xiaomi 12 Pro', year: 2022, soc: 'Snapdragon 8 Gen 1', ram_gb: [8, 12], storage_gb: [128, 256], battery: 4600, display: { size_inch: 6.73, type: 'AMOLED', refresh_rate: 120, width: 1440, height: 3200 }, camera: { front: 32, rear: [50, 50, 50] } },
    { name: 'Xiaomi 13', year: 2023, soc: 'Snapdragon 8 Gen 2', ram_gb: [8, 12], storage_gb: [128, 256], battery: 4500, display: { size_inch: 6.36, type: 'AMOLED', refresh_rate: 120, width: 1080, height: 2400 }, camera: { front: 32, rear: [54, 12, 10] } },
    { name: 'Xiaomi 13 Pro', year: 2023, soc: 'Snapdragon 8 Gen 2', ram_gb: [8, 12], storage_gb: [128, 256, 512], battery: 4820, display: { size_inch: 6.73, type: 'AMOLED', refresh_rate: 120, width: 1440, height: 3200 }, camera: { front: 32, rear: [50, 50, 50] } },
    { name: 'Xiaomi 13 Ultra', year: 2023, soc: 'Snapdragon 8 Gen 2', ram_gb: [12, 16], storage_gb: [256, 512, 1024], battery: 5000, display: { size_inch: 6.73, type: 'AMOLED', refresh_rate: 120, width: 3200, height: 1440 }, camera: { front: 32, rear: [50, 50, 50] } },
    { name: 'Xiaomi 14', year: 2024, soc: 'Snapdragon 8 Gen 3', ram_gb: [12, 16], storage_gb: [256, 512], battery: 4610, display: { size_inch: 6.36, type: 'AMOLED', refresh_rate: 120, width: 1200, height: 2670 }, camera: { front: 32, rear: [50, 50, 50] } },
    { name: 'Xiaomi 14 Pro', year: 2024, soc: 'Snapdragon 8 Gen 3', ram_gb: [12, 16], storage_gb: [256, 512, 1024], battery: 5000, display: { size_inch: 6.73, type: 'AMOLED', refresh_rate: 120, width: 1440, height: 3200 }, camera: { front: 32, rear: [50, 50, 50] } },
    { name: 'Xiaomi 14 Ultra', year: 2024, soc: 'Snapdragon 8 Gen 3', ram_gb: [16], storage_gb: [256, 512, 1024], battery: 5000, display: { size_inch: 6.73, type: 'AMOLED', refresh_rate: 120, width: 1440, height: 3200 }, camera: { front: 32, rear: [50, 50, 50] } },
    { name: 'Xiaomi 15', year: 2025, soc: 'Snapdragon 8 Elite', ram_gb: [12, 16], storage_gb: [256, 512], battery: 5240, display: { size_inch: 6.36, type: 'AMOLED', refresh_rate: 120, width: 1200, height: 2670 }, camera: { front: 32, rear: [50, 50, 50] } },
    { name: 'Xiaomi 15 Ultra', year: 2025, soc: 'Snapdragon 8 Elite', ram_gb: [16], storage_gb: [256, 512, 1024], battery: 6000, display: { size_inch: 6.73, type: 'AMOLED', refresh_rate: 120, width: 1440, height: 3200 }, camera: { front: 50, rear: [200, 50, 50] } },
    { name: 'Redmi Note 12', year: 2023, soc: 'Snapdragon 685', ram_gb: [4, 6, 8], storage_gb: [64, 128], battery: 5000, display: { size_inch: 6.67, type: 'AMOLED', refresh_rate: 120, width: 1080, height: 2400 }, camera: { front: 13, rear: [50, 8, 2] } },
    { name: 'Redmi Note 13 Pro+', year: 2024, soc: 'MediaTek Dimensity 7200 Ultra', ram_gb: [8, 12], storage_gb: [256, 512], battery: 5000, display: { size_inch: 6.67, type: 'AMOLED', refresh_rate: 120, width: 1220, height: 2712 }, camera: { front: 16, rear: [200, 8, 2] } },
    { name: 'POCO X6 Pro', year: 2024, soc: 'MediaTek Dimensity 8300 Ultra', ram_gb: [8, 12], storage_gb: [256, 512], battery: 5000, display: { size_inch: 6.67, type: 'AMOLED', refresh_rate: 120, width: 1220, height: 2712 }, camera: { front: 16, rear: [64, 8, 2] } },
    { name: 'POCO F6 Pro', year: 2024, soc: 'Snapdragon 8 Gen 2', ram_gb: [12, 16], storage_gb: [256, 512, 1024], battery: 5000, display: { size_inch: 6.67, type: 'AMOLED', refresh_rate: 120, width: 1440, height: 3200 }, camera: { front: 16, rear: [50, 8, 2] } },
  ]},

  /* ─────────────── SONY ─────────────── */
  { brand: 'Sony', models: [
    { name: 'Xperia XZ2', year: 2018, soc: 'Snapdragon 845', ram_gb: [6], storage_gb: [64, 128], battery: 3180, display: { size_inch: 5.7, type: 'AMOLED', refresh_rate: 60, width: 1080, height: 2160 }, camera: { front: 5, rear: [19] } },
    { name: 'Xperia 1', year: 2019, soc: 'Snapdragon 855', ram_gb: [6], storage_gb: [128], battery: 3330, display: { size_inch: 6.5, type: 'OLED', refresh_rate: 60, width: 1644, height: 3840 }, camera: { front: 8, rear: [12, 12, 12] } },
    { name: 'Xperia 5', year: 2019, soc: 'Snapdragon 855', ram_gb: [6], storage_gb: [128], battery: 3140, display: { size_inch: 6.1, type: 'OLED', refresh_rate: 60, width: 1080, height: 2520 }, camera: { front: 8, rear: [12, 12, 12] } },
    { name: 'Xperia 1 II', year: 2020, soc: 'Snapdragon 865', ram_gb: [8], storage_gb: [256], battery: 4000, display: { size_inch: 6.5, type: 'OLED', refresh_rate: 60, width: 1644, height: 3840 }, camera: { front: 8, rear: [12, 12, 12] } },
    { name: 'Xperia 1 III', year: 2021, soc: 'Snapdragon 888', ram_gb: [12], storage_gb: [256, 512], battery: 4500, display: { size_inch: 6.5, type: 'OLED', refresh_rate: 120, width: 1644, height: 3840 }, camera: { front: 8, rear: [12, 12, 12] } },
    { name: 'Xperia 1 IV', year: 2022, soc: 'Snapdragon 8 Gen 1', ram_gb: [12], storage_gb: [256, 512], battery: 5000, display: { size_inch: 6.5, type: 'OLED', refresh_rate: 120, width: 1644, height: 3840 }, camera: { front: 12, rear: [12, 12, 12] } },
    { name: 'Xperia 1 V', year: 2023, soc: 'Snapdragon 8 Gen 2', ram_gb: [12], storage_gb: [256, 512], battery: 5000, display: { size_inch: 6.5, type: 'OLED', refresh_rate: 120, width: 1644, height: 3840 }, camera: { front: 12, rear: [52, 12, 12] } },
    { name: 'Xperia 1 VI', year: 2024, soc: 'Snapdragon 8 Gen 3', ram_gb: [12], storage_gb: [256, 512], battery: 5000, display: { size_inch: 6.5, type: 'OLED', refresh_rate: 120, width: 1080, height: 2340 }, camera: { front: 12, rear: [48, 12, 12] } },
    { name: 'Xperia 5 VI', year: 2024, soc: 'Snapdragon 8 Gen 3', ram_gb: [8], storage_gb: [128, 256], battery: 5000, display: { size_inch: 6.1, type: 'OLED', refresh_rate: 120, width: 1080, height: 2520 }, camera: { front: 12, rear: [48, 12] } },
  ]},

  /* ─────────────── NOTHING ─────────────── */
  { brand: 'Nothing', models: [
    { name: 'Phone (1)', year: 2022, soc: 'Snapdragon 778G+', ram_gb: [8, 12], storage_gb: [128, 256], battery: 4500, display: { size_inch: 6.55, type: 'AMOLED', refresh_rate: 120, width: 1080, height: 2400 }, camera: { front: 16, rear: [50, 50] } },
    { name: 'Phone (2)', year: 2023, soc: 'Snapdragon 8+ Gen 1', ram_gb: [8, 12], storage_gb: [128, 256, 512], battery: 4700, display: { size_inch: 6.7, type: 'AMOLED', refresh_rate: 120, width: 1080, height: 2412 }, camera: { front: 32, rear: [50, 50] } },
    { name: 'Phone (2a)', year: 2024, soc: 'MediaTek Dimensity 7200 Pro', ram_gb: [8, 12], storage_gb: [128, 256], battery: 5000, display: { size_inch: 6.7, type: 'AMOLED', refresh_rate: 120, width: 1080, height: 2412 }, camera: { front: 32, rear: [50, 50] } },
    { name: 'Phone (2a) Plus', year: 2024, soc: 'MediaTek Dimensity 7350 Pro', ram_gb: [12], storage_gb: [256], battery: 5000, display: { size_inch: 6.7, type: 'AMOLED', refresh_rate: 120, width: 1080, height: 2412 }, camera: { front: 50, rear: [50, 50] } },
    { name: 'Phone (3a)', year: 2025, soc: 'Snapdragon 7s Gen 3', ram_gb: [8, 12], storage_gb: [128, 256], battery: 5000, display: { size_inch: 6.77, type: 'AMOLED', refresh_rate: 120, width: 1080, height: 2392 }, camera: { front: 32, rear: [50, 50, 8] } },
    { name: 'Phone (3a) Pro', year: 2025, soc: 'Snapdragon 7s Gen 3', ram_gb: [12], storage_gb: [256], battery: 5000, display: { size_inch: 6.77, type: 'AMOLED', refresh_rate: 120, width: 1080, height: 2392 }, camera: { front: 32, rear: [50, 50, 50] } },
  ]},

  /* ─────────────── MOTOROLA ─────────────── */
  { brand: 'Motorola', models: [
    { name: 'Moto G6', year: 2018, soc: 'Snapdragon 450', ram_gb: [3], storage_gb: [32, 64], battery: 3000, display: { size_inch: 5.7, type: 'LCD', refresh_rate: 60, width: 1080, height: 2160 }, camera: { front: 8, rear: [12, 5] } },
    { name: 'Moto Z3', year: 2018, soc: 'Snapdragon 835', ram_gb: [4], storage_gb: [64], battery: 3000, display: { size_inch: 6.0, type: 'AMOLED', refresh_rate: 60, width: 1080, height: 2160 }, camera: { front: 8, rear: [13] } },
    { name: 'Moto G7', year: 2019, soc: 'Snapdragon 632', ram_gb: [4], storage_gb: [64], battery: 3000, display: { size_inch: 6.24, type: 'LCD', refresh_rate: 60, width: 1080, height: 2270 }, camera: { front: 8, rear: [12, 5] } },
    { name: 'Moto G8 Power', year: 2020, soc: 'Snapdragon 665', ram_gb: [4], storage_gb: [64], battery: 5000, display: { size_inch: 6.4, type: 'LCD', refresh_rate: 60, width: 1080, height: 2300 }, camera: { front: 16, rear: [16, 8, 8, 2] } },
    { name: 'Moto G100', year: 2021, soc: 'Snapdragon 870', ram_gb: [8], storage_gb: [128], battery: 5000, display: { size_inch: 6.7, type: 'LCD', refresh_rate: 90, width: 1080, height: 2520 }, camera: { front: 16, rear: [64, 16, 2] } },
    { name: 'Moto Edge 30 Pro', year: 2022, soc: 'Snapdragon 8 Gen 1', ram_gb: [8, 12], storage_gb: [128, 256], battery: 4800, display: { size_inch: 6.67, type: 'pOLED', refresh_rate: 144, width: 1080, height: 2400 }, camera: { front: 60, rear: [50, 50, 2] } },
    { name: 'Moto Edge 40 Pro', year: 2023, soc: 'Snapdragon 8 Gen 2', ram_gb: [12], storage_gb: [256], battery: 4600, display: { size_inch: 6.67, type: 'pOLED', refresh_rate: 165, width: 1080, height: 2400 }, camera: { front: 60, rear: [50, 50, 12] } },
    { name: 'Moto Edge 50 Pro', year: 2024, soc: 'Snapdragon 7 Gen 3', ram_gb: [12], storage_gb: [256, 512], battery: 4500, display: { size_inch: 6.67, type: 'pOLED', refresh_rate: 144, width: 1220, height: 2712 }, camera: { front: 50, rear: [50, 13, 10] } },
    { name: 'Moto Razr+ (2024)', year: 2024, soc: 'Snapdragon 8s Gen 3', ram_gb: [12], storage_gb: [256, 512], battery: 4000, display: { size_inch: 6.9, type: 'pOLED', refresh_rate: 165, width: 1080, height: 2640 }, camera: { front: 32, rear: [50, 12] } },
  ]},

  /* ─────────────── REALME ─────────────── */
  { brand: 'Realme', models: [
    { name: 'Realme 3 Pro', year: 2019, soc: 'Snapdragon 710', ram_gb: [4, 6], storage_gb: [64, 128], battery: 4045, display: { size_inch: 6.3, type: 'LCD', refresh_rate: 60, width: 1080, height: 2340 }, camera: { front: 25, rear: [16, 5] } },
    { name: 'Realme 6', year: 2020, soc: 'MediaTek Helio G90T', ram_gb: [4, 6, 8], storage_gb: [64, 128], battery: 4300, display: { size_inch: 6.5, type: 'LCD', refresh_rate: 90, width: 1080, height: 2400 }, camera: { front: 16, rear: [64, 8, 2, 2] } },
    { name: 'Realme GT', year: 2021, soc: 'Snapdragon 888', ram_gb: [8, 12], storage_gb: [128, 256], battery: 4500, display: { size_inch: 6.43, type: 'AMOLED', refresh_rate: 120, width: 1080, height: 2400 }, camera: { front: 16, rear: [64, 8, 2] } },
    { name: 'Realme GT2 Pro', year: 2022, soc: 'Snapdragon 8 Gen 1', ram_gb: [8, 12], storage_gb: [128, 256, 512], battery: 5000, display: { size_inch: 6.7, type: 'AMOLED', refresh_rate: 120, width: 1440, height: 3216 }, camera: { front: 32, rear: [50, 50, 2] } },
    { name: 'Realme GT3', year: 2023, soc: 'Snapdragon 8+ Gen 1', ram_gb: [8, 16], storage_gb: [256, 1024], battery: 4600, display: { size_inch: 6.74, type: 'AMOLED', refresh_rate: 144, width: 1240, height: 2772 }, camera: { front: 16, rear: [50, 8, 2] } },
    { name: 'Realme GT 6', year: 2024, soc: 'Snapdragon 8s Gen 3', ram_gb: [8, 12, 16], storage_gb: [256, 512], battery: 5500, display: { size_inch: 6.78, type: 'AMOLED', refresh_rate: 120, width: 1264, height: 2780 }, camera: { front: 32, rear: [50, 8, 2] } },
  ]},

  /* ─────────────── ASUS ─────────────── */
  { brand: 'ASUS', models: [
    { name: 'ROG Phone', year: 2018, soc: 'Snapdragon 845', ram_gb: [8], storage_gb: [128], battery: 4000, display: { size_inch: 6.0, type: 'AMOLED', refresh_rate: 90, width: 1080, height: 2160 }, camera: { front: 8, rear: [12] } },
    { name: 'ROG Phone II', year: 2019, soc: 'Snapdragon 855+', ram_gb: [8, 12], storage_gb: [128, 512], battery: 6000, display: { size_inch: 6.59, type: 'AMOLED', refresh_rate: 120, width: 1080, height: 2340 }, camera: { front: 24, rear: [48, 13] } },
    { name: 'ROG Phone 3', year: 2020, soc: 'Snapdragon 865+', ram_gb: [8, 12, 16], storage_gb: [128, 256, 512], battery: 6000, display: { size_inch: 6.59, type: 'AMOLED', refresh_rate: 144, width: 1080, height: 2340 }, camera: { front: 24, rear: [64, 13, 5] } },
    { name: 'ROG Phone 5', year: 2021, soc: 'Snapdragon 888', ram_gb: [8, 12, 16], storage_gb: [128, 256], battery: 6000, display: { size_inch: 6.78, type: 'AMOLED', refresh_rate: 144, width: 1080, height: 2448 }, camera: { front: 24, rear: [64, 13, 5] } },
    { name: 'ROG Phone 6', year: 2022, soc: 'Snapdragon 8+ Gen 1', ram_gb: [8, 12, 16, 18], storage_gb: [128, 256, 512], battery: 6000, display: { size_inch: 6.78, type: 'AMOLED', refresh_rate: 165, width: 1080, height: 2448 }, camera: { front: 12, rear: [64, 13, 5] } },
    { name: 'ROG Phone 7', year: 2023, soc: 'Snapdragon 8 Gen 2', ram_gb: [8, 12, 16], storage_gb: [256, 512], battery: 6000, display: { size_inch: 6.78, type: 'AMOLED', refresh_rate: 165, width: 1080, height: 2448 }, camera: { front: 32, rear: [50, 13, 5] } },
    { name: 'ROG Phone 8', year: 2024, soc: 'Snapdragon 8 Gen 3', ram_gb: [12, 16], storage_gb: [256, 512], battery: 5500, display: { size_inch: 6.78, type: 'AMOLED', refresh_rate: 165, width: 1080, height: 2400 }, camera: { front: 32, rear: [50, 13, 5] } },
    { name: 'Zenfone 10', year: 2023, soc: 'Snapdragon 8 Gen 2', ram_gb: [8, 16], storage_gb: [128, 256, 512], battery: 4300, display: { size_inch: 5.92, type: 'AMOLED', refresh_rate: 144, width: 1080, height: 2400 }, camera: { front: 32, rear: [50, 13] } },
    { name: 'Zenfone 11 Ultra', year: 2024, soc: 'Snapdragon 8 Gen 3', ram_gb: [12, 16], storage_gb: [256, 512], battery: 5500, display: { size_inch: 6.78, type: 'AMOLED', refresh_rate: 144, width: 1080, height: 2400 }, camera: { front: 32, rear: [50, 13, 10] } },
  ]},

  /* ─────────────── HUAWEI ─────────────── */
  { brand: 'Huawei', models: [
    { name: 'P20 Pro', year: 2018, soc: 'HiSilicon Kirin 970', ram_gb: [6], storage_gb: [128], battery: 4000, display: { size_inch: 6.1, type: 'AMOLED', refresh_rate: 60, width: 1080, height: 2240 }, camera: { front: 24, rear: [40, 20, 8] } },
    { name: 'Mate 20 Pro', year: 2018, soc: 'HiSilicon Kirin 980', ram_gb: [6], storage_gb: [128], battery: 4200, display: { size_inch: 6.39, type: 'AMOLED', refresh_rate: 60, width: 1440, height: 3120 }, camera: { front: 24, rear: [40, 20, 8] } },
    { name: 'P30 Pro', year: 2019, soc: 'HiSilicon Kirin 980', ram_gb: [6, 8], storage_gb: [128, 256, 512], battery: 4200, display: { size_inch: 6.47, type: 'AMOLED', refresh_rate: 60, width: 1080, height: 2340 }, camera: { front: 32, rear: [40, 20, 8] } },
    { name: 'P40 Pro', year: 2020, soc: 'HiSilicon Kirin 990 5G', ram_gb: [8], storage_gb: [256], battery: 4200, display: { size_inch: 6.58, type: 'AMOLED', refresh_rate: 90, width: 1200, height: 2640 }, camera: { front: 32, rear: [50, 40, 12] } },
    { name: 'P50 Pro', year: 2021, soc: 'HiSilicon Kirin 9000', ram_gb: [8], storage_gb: [128, 256, 512], battery: 4360, display: { size_inch: 6.6, type: 'AMOLED', refresh_rate: 120, width: 1228, height: 2700 }, camera: { front: 13, rear: [50, 64, 13] } },
    { name: 'Mate 50 Pro', year: 2022, soc: 'Snapdragon 8+ Gen 1', ram_gb: [8], storage_gb: [256, 512], battery: 4700, display: { size_inch: 6.74, type: 'AMOLED', refresh_rate: 120, width: 1212, height: 2616 }, camera: { front: 13, rear: [50, 13, 64] } },
    { name: 'Pura 70 Pro', year: 2024, soc: 'HiSilicon Kirin 9010', ram_gb: [12], storage_gb: [256, 512, 1024], battery: 5050, display: { size_inch: 6.8, type: 'AMOLED', refresh_rate: 120, width: 1260, height: 2844 }, camera: { front: 13, rear: [50, 13, 48] } },
  ]},

  /* ─────────────── OPPO / FIND / RENO ─────────────── */
  { brand: 'OPPO', models: [
    { name: 'Find X', year: 2018, soc: 'Snapdragon 845', ram_gb: [8], storage_gb: [128, 256], battery: 3730, display: { size_inch: 6.42, type: 'AMOLED', refresh_rate: 60, width: 1080, height: 2340 }, camera: { front: 25, rear: [16, 20] } },
    { name: 'Find X2 Pro', year: 2020, soc: 'Snapdragon 865', ram_gb: [12], storage_gb: [512], battery: 4260, display: { size_inch: 6.7, type: 'AMOLED', refresh_rate: 120, width: 1440, height: 3168 }, camera: { front: 32, rear: [48, 12, 13] } },
    { name: 'Find X3 Pro', year: 2021, soc: 'Snapdragon 888', ram_gb: [12], storage_gb: [256], battery: 4500, display: { size_inch: 6.7, type: 'AMOLED', refresh_rate: 120, width: 1440, height: 3216 }, camera: { front: 32, rear: [50, 50, 13, 3] } },
    { name: 'Find X5 Pro', year: 2022, soc: 'Snapdragon 8 Gen 1', ram_gb: [12], storage_gb: [256], battery: 5000, display: { size_inch: 6.7, type: 'AMOLED', refresh_rate: 120, width: 1440, height: 3216 }, camera: { front: 32, rear: [50, 50, 13] } },
    { name: 'Find X6 Pro', year: 2023, soc: 'Snapdragon 8 Gen 2', ram_gb: [12, 16], storage_gb: [256, 512], battery: 5000, display: { size_inch: 6.82, type: 'AMOLED', refresh_rate: 120, width: 1440, height: 3168 }, camera: { front: 32, rear: [50, 50, 48] } },
    { name: 'Find X7 Ultra', year: 2024, soc: 'Snapdragon 8 Gen 3', ram_gb: [16], storage_gb: [256, 512, 1024], battery: 5000, display: { size_inch: 6.82, type: 'AMOLED', refresh_rate: 120, width: 1440, height: 3168 }, camera: { front: 32, rear: [50, 50, 50] } },
    { name: 'Reno 12 Pro', year: 2024, soc: 'MediaTek Dimensity 9200+', ram_gb: [12], storage_gb: [256, 512], battery: 5000, display: { size_inch: 6.7, type: 'AMOLED', refresh_rate: 120, width: 1080, height: 2412 }, camera: { front: 50, rear: [50, 8, 2] } },
  ]},

  /* ─────────────── VIVO ─────────────── */
  { brand: 'Vivo', models: [
    { name: 'X50 Pro', year: 2020, soc: 'Snapdragon 765G', ram_gb: [8], storage_gb: [128, 256], battery: 4315, display: { size_inch: 6.56, type: 'AMOLED', refresh_rate: 90, width: 1080, height: 2376 }, camera: { front: 32, rear: [48, 8, 13, 8] } },
    { name: 'X70 Pro+', year: 2021, soc: 'Snapdragon 888+', ram_gb: [8, 12], storage_gb: [256, 512], battery: 4500, display: { size_inch: 6.78, type: 'AMOLED', refresh_rate: 120, width: 1440, height: 3200 }, camera: { front: 32, rear: [50, 48, 12, 8] } },
    { name: 'X80 Pro', year: 2022, soc: 'Snapdragon 8 Gen 1', ram_gb: [12], storage_gb: [256, 512], battery: 4700, display: { size_inch: 6.78, type: 'AMOLED', refresh_rate: 120, width: 1440, height: 3200 }, camera: { front: 32, rear: [50, 48, 12, 8] } },
    { name: 'X90 Pro+', year: 2023, soc: 'Snapdragon 8 Gen 2', ram_gb: [12], storage_gb: [256, 512], battery: 4700, display: { size_inch: 6.78, type: 'AMOLED', refresh_rate: 120, width: 1440, height: 3200 }, camera: { front: 32, rear: [50, 50, 64] } },
    { name: 'X100 Pro', year: 2024, soc: 'MediaTek Dimensity 9300', ram_gb: [12, 16], storage_gb: [256, 512, 1024], battery: 5400, display: { size_inch: 6.78, type: 'AMOLED', refresh_rate: 120, width: 1260, height: 2800 }, camera: { front: 32, rear: [50, 50, 64] } },
    { name: 'X200 Pro', year: 2025, soc: 'MediaTek Dimensity 9400', ram_gb: [16], storage_gb: [512, 1024], battery: 6000, display: { size_inch: 6.78, type: 'AMOLED', refresh_rate: 120, width: 1260, height: 2800 }, camera: { front: 32, rear: [200, 50, 50] } },
  ]},
];

/** Get unique sorted list of all brands */
export const PHONE_BRANDS = [...new Set(PHONE_DB.map(b => b.brand))].sort();

/** Get models for a given brand */
export function getModelsForBrand(brand) {
  const entry = PHONE_DB.find(b => b.brand === brand);
  return entry ? entry.models.sort((a, b) => b.year - a.year) : [];
}
