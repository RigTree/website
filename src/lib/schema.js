export function createDefaultProfile(username) {
  return {
    username,
    profile: {
      display_name: '',
      location: '',
      github: username,
    },
    computers: [],
    phones: [],
    last_updated: new Date().toISOString(),
  };
}

export function createDefaultComputer(id) {
  return {
    id: id || `computer-${Date.now()}`,
    type: 'desktop',
    name: '',
    role: 'daily-driver',
    description: '',
    manufacturer: 'Custom Build',
    virtual_machine: false,
    year: new Date().getFullYear(),
    components: {
      cpu: { brand: '', series: '', model: '', architecture: '', cores: 0, threads: 0, base_clock_mhz: 0 },
      gpu: [],
      ram: [],
      motherboard: { brand: '', model: '', chipset: '' },
      storage: [],
      psu: { brand: '', model: '', wattage: 0, efficiency: '' },
      cooler: { brand: '', model: '', fans: 0, water_cooling: false },
      case: { brand: '', model: '', fans: 0 },
    },
    software: {
      os: { name: '', version: '', edition: '' },
    },
    peripherals: {
      monitor: [],
      keyboard: { brand: '', model: '', switches: '', layout: 100 },
      mouse: { brand: '', model: '' },
      audio: {
        headphones: { brand: '', model: '' },
        microphone: { brand: '', model: '' },
        speakers: { brand: '', model: '' },
      },
    },
    camera: { brand: '', model: '', resolution: { width: 0, height: 0 }, fps: 0 },
  };
}

export function createDefaultGpu() {
  return { brand: '', model: '', vram_gb: 0 };
}

export function createDefaultRam() {
  return { type: 'DDR4', capacity_gb: 0, modules: 1, speed_mhz: 0, manufacturer: '', model: '' };
}

export function createDefaultStorage() {
  return { type: 'SSD', form_factor: 'M.2', brand: '', model: '', capacity_gb: 0 };
}

export function createDefaultMonitor() {
  return { brand: '', model: '', size_inch: 0, resolution: { width: 1920, height: 1080 }, refresh_rate_hz: 60 };
}

export function createDefaultPhone() {
  return {
    brand: '',
    model: '',
    soc: '',
    ram_gb: 0,
    storage_gb: 0,
    battery: 0,
    display: { size_inch: 0, resolution: { width: 0, height: 0 }, refresh_rate: 60, type: 'AMOLED' },
    camera: { front: 0, rear: [] },
    os: { name: '', root: false },
  };
}

export const COMPUTER_TYPES = ['desktop', 'laptop', 'server', 'workstation'];
export const COMPUTER_ROLES = ['daily-driver', 'secondary', 'gaming', 'workstation', 'server', 'media', 'development'];
export const RAM_TYPES = ['DDR3', 'DDR4', 'DDR5', 'SODIMM DDR4', 'SODIMM DDR5', 'LPDDR4', 'LPDDR5'];
export const STORAGE_TYPES = ['SSD', 'HDD', 'NVMe'];
export const STORAGE_FORM_FACTORS = ['M.2', 'SATA', '2.5"', '3.5"'];
export const PSU_EFFICIENCIES = ['', '80+', 'Bronze', 'Silver', 'Gold', 'Platinum', 'Titanium'];
export const DISPLAY_TYPES = ['AMOLED', 'OLED', 'LCD', 'IPS', 'Mini-LED', 'Micro-LED'];
