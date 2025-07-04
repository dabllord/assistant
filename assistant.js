const script = registerScript({
  name: "FunTime-Assistant",
  version: "1.0.0",
  authors: ["Misha Sigma Gucci(tg - @mishasigmagucci)"]
});

const ClientChatKt = Java.type("net.ccbluex.liquidbounce.utils.client.ClientChat")
const Severity = Java.type("net.ccbluex.liquidbounce.event.events.NotificationEvent.Severity")
const Slots = Java.type("net.ccbluex.liquidbounce.utils.inventory.Slots")
const SilentHotbar = Java.type("net.ccbluex.liquidbounce.utils.client.SilentHotbar")
const InventoryUtilsKt = Java.type("net.ccbluex.liquidbounce.utils.inventory.InventoryUtilsKt")
const Items = Java.type("net.minecraft.item.Items")
const DataComponentTypes = Java.type("net.minecraft.component.DataComponentTypes")
const Colors = Java.type("net.minecraft.util.Colors")

script.registerModule({
  name: "Assistant",
  category: "Misc", 
  description: "Assistant for FunTime",
  settings: {
    disorientation: Setting.key({
      name: "disorientation",
      default: "key.keyboard.unknown"
    }),

    dust: Setting.key({
      name: "dust",
      default: "key.keyboard.unknown"
    }),

    trap: Setting.key({
      name: "trap",
      default: "key.keyboard.unknown"
    }),

    aura: Setting.key({
      name: "aura",
      default: "key.keyboard.unknown" 
    }),

    tornado: Setting.key({
      name: "tornado",
      default: "key.keyboard.unknown"
    }),

    layer: Setting.key({
      name: "layer",
      default: "key.keyboard.unknown"
    }),

    ah_helper: Setting.boolean({
      name: "Auction Helper",
      default: false
    })
  }
}, (mod) => {

  function extract_item_price(str) {
    return parseFloat(str.replaceAll(",", "").match(/\$([\d,]+)/)[1])
  }

  function is_on_auction(screen) {
    if (!screen) {
      return false
    }

    if (!screen.getTitle().getString().contains("Аукцион") && !screen.getTitle().getString().contains("Поиск:")) {
      return false
    }

    return mod.settings.ah_helper
  }

  class vector {
    constructor(x=0, y=0) {
      this.x = x 
      this.y = y
    }
  }

  lowest_price_item_pos = new vector(0, 0)
  mod.on("playerTick", () => {
    const screen = mc.currentScreen
    if (!is_on_auction(screen)) {
      return
    }
    
    lowest_price = Number.MAX_VALUE

    const handler = screen.screenHandler
    handler.slots.filter(slot => {
      return slot.index <= 44;
    }).forEach(slot => {
      const components = slot.getStack().getComponents()
      if (components.contains(DataComponentTypes.LORE)) {
        const lore_comp = components.get(DataComponentTypes.LORE)
        lore_comp.lines().filter(line => {
          return line.getString().toLowerCase().contains("$ ценa")
        }).forEach(line => {
          price = extract_item_price(line.getString().toLowerCase())
          if (price < lowest_price) {
            lowest_price = price
            lowest_price_item_pos.x = slot.x
            lowest_price_item_pos.y = slot.yв
          }
        })
      }
    });

    lowest_price = Number.MAX_VALUE
  })

  mod.on("screenRender", (event) => {
    const screen = mc.currentScreen
    const context = event.getContext()

    if (!is_on_auction(screen)) {
      return
    }

    context.getMatrices().push()
		context.getMatrices().translate((screen.width - screen.backgroundWidth) / 2, (screen.height - screen.backgroundHeight) / 2, 0)

    context.fill(lowest_price_item_pos.x, lowest_price_item_pos.y, lowest_price_item_pos.x + 16, lowest_price_item_pos.y + 16, Colors.GREEN)
    context.getMatrices().pop()
  })

  mod.on("key", (event) => {
    if (event.getAction() === 1) {
      if (event.getKey().getTranslationKey() == mod.settings.disorientation.value) {
        const slot = Slots.Hotbar.findSlot(Items.ENDER_EYE)
        if (slot) {
          SilentHotbar.INSTANCE.selectSlotSilently(this, slot, 1)
          InventoryUtilsKt.useHotbarSlotOrOffhand(slot, 1, mc.player.yaw, mc.player.pitch)
          ClientChatKt.notification(`FT Assistant`, `Дезориентация использована`, Severity.SUCCESS);
        } else {
          ClientChatKt.notification(`FT Assistant`, `Дезориентация не найдена в хотбаре`, Severity.ERROR);
        }
      }
      
      if (event.getKey().getTranslationKey() == mod.settings.dust.value) {
        const slot = Slots.Hotbar.findSlot(Items.SUGAR)
        if (slot) {
          SilentHotbar.INSTANCE.selectSlotSilently(this, slot, 1)
          InventoryUtilsKt.useHotbarSlotOrOffhand(slot, 1, mc.player.yaw, mc.player.pitch)
          ClientChatKt.notification(`FT Assistant`, `Явная пыль использована`, Severity.SUCCESS);
        } else {
          ClientChatKt.notification(`FT Assistant`, `Явная пыль не найдена в хотбаре`, Severity.ERROR);
        }
      }

      if (event.getKey().getTranslationKey() == mod.settings.trap.value) {
        const slot = Slots.Hotbar.findSlot(Items.NETHERITE_SCRAP)
        if (slot) {
          SilentHotbar.INSTANCE.selectSlotSilently(this, slot, 1)
          InventoryUtilsKt.useHotbarSlotOrOffhand(slot, 1, mc.player.yaw, mc.player.pitch)
          ClientChatKt.notification(`FT Assistant`, `Трапка использована`, Severity.SUCCESS);
        } else {
          ClientChatKt.notification(`FT Assistant`, `Трапка не найдена в хотбаре`, Severity.ERROR);
        }
      }

      if (event.getKey().getTranslationKey() == mod.settings.aura.value) {
        const slot = Slots.Hotbar.findSlot(Items.PHANTOM_MEMBRANE)
        if (slot) {
          SilentHotbar.INSTANCE.selectSlotSilently(this, slot, 1)
          InventoryUtilsKt.useHotbarSlotOrOffhand(slot, 1, mc.player.yaw, mc.player.pitch)
          ClientChatKt.notification(`FT Assistant`, `Божья аура использована`, Severity.SUCCESS);
        } else {
          ClientChatKt.notification(`FT Assistant`, `Божья аура не найдена в хотбаре`, Severity.ERROR);
        }
      }

      if (event.getKey().getTranslationKey() == mod.settings.tornado.value) {
        const slot = Slots.Hotbar.findSlot(Items.FIRE_CHARGE)
        if (slot) {
          SilentHotbar.INSTANCE.selectSlotSilently(this, slot, 1)
          InventoryUtilsKt.useHotbarSlotOrOffhand(slot, 1, mc.player.yaw, mc.player.pitch)
          ClientChatKt.notification(`FT Assistant`, `Огненый смерч использован`, Severity.SUCCESS);
        } else {
          ClientChatKt.notification(`FT Assistant`, `Огненый смерч не найден в хотбаре`, Severity.ERROR);
        }
      }

      if (event.getKey().getTranslationKey() == mod.settings.layer.value) {
        const slot = Slots.Hotbar.findSlot(Items.DRIED_KELP)
        if (slot) {
          SilentHotbar.INSTANCE.selectSlotSilently(this, slot, 1)
          InventoryUtilsKt.useHotbarSlotOrOffhand(slot, 1, mc.player.yaw, mc.player.pitch)
          ClientChatKt.notification(`FT Assistant`, `Пласт использован`, Severity.SUCCESS);
        } else {
          ClientChatKt.notification(`FT Assistant`, `Пласт не найден в хотбаре`, Severity.ERROR);
        }
      }
    }
  })
});
