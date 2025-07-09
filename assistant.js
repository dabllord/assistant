const script = registerScript({
  name: "FT-Assistant",
  version: "3.0.0",
  authors: ["Misha Sigma Gucci (tg - @mishasigmagucci)"]
});

const NotificationEvent = Java.type("net.ccbluex.liquidbounce.event.events.NotificationEvent")
const ReentrantLock = Java.type("java.util.concurrent.locks.ReentrantLock")
const Slots = Java.type("net.ccbluex.liquidbounce.utils.inventory.Slots")
const Items = Java.type("net.minecraft.item.Items")
const ItemSlotType = Java.type("net.ccbluex.liquidbounce.features.module.modules.player.invcleaner.ItemSlotType")
const ClickInventoryAction = Java.type("net.ccbluex.liquidbounce.utils.inventory.ClickInventoryAction")
const HotbarItemSlot = Java.type("net.ccbluex.liquidbounce.utils.inventory.HotbarItemSlot")
const InventoryUtilsKt = Java.type("net.ccbluex.liquidbounce.utils.inventory.InventoryUtilsKt")
const SilentHotbat = Java.type("net.ccbluex.liquidbounce.utils.client.SilentHotbar")
const SlotActionType = Java.type("net.minecraft.screen.slot.SlotActionType")

const key_actions = {
  release: 0,
  down: 1,
  repeat: 2
}

const assitant_items = {
  disorientation: Items.ENDER_EYE,
  dust: Items.SUGAR,
  trap: Items.NETHERITE_SCRAP,
  aura: Items.PHANTOM_MEMBRANE,
  tornado: Items.FIRE_CHARGE,
  layer: Items.DRIED_KELP,
  none: null
}

script.registerModule({
  name: "Assistant",
  category: "Misc", 
  description: "Assistant for FunTime",
  settings: {
    disorientation: Setting.key({
      name: "Disorientation",
      default: "key.keyboard.unknown"
    }),

    dust: Setting.key({
      name: "Dust", 
      default: "key.keyboard.unknown"
    }),

    trap: Setting.key({
      name: "Trap",
      default: "key.keyboard.unknown"
    }),

    aura: Setting.key({
      name: "Aura",
      default: "key.keyboard.unknown" 
    }),

    tornado: Setting.key({
      name: "Tornado",
      default: "key.keyboard.unknown"
    }),

    layer: Setting.key({
      name: "Layer",
      default: "key.keyboard.unknown"
    }),

    swap_delay: Setting.int({
      name: "Swap delay",
      default: 0,
      range: [0, 20]
    })
  }
}, (mod) => {
  current_slot = assitant_items.none
  
  mod.on("gameTick", e => {
    const interaction =  mc.interactionManager
    switch (current_slot) {
      case assitant_items.disorientation: 
        const disorientation = Slots.All.findSlot(assitant_items.disorientation)
        if (!disorientation) {
          Client.eventManager.callEvent(new NotificationEvent("FT-Assistant", "Дезориентация не найдена", NotificationEvent.Severity.ERROR))
          current_slot = assitant_items.none
          return
        }

        if (disorientation.slotType == ItemSlotType.INVENTORY) {          
          InventoryUtilsKt.openInventorySilently()

          interaction.clickSlot(mc.player.currentScreenHandler.syncId, disorientation.getIdForServer(mc.currentScreen), mc.player.getInventory().selectedSlot, SlotActionType.SWAP, mc.player)

          InventoryUtilsKt.useHotbarSlotOrOffhand(new HotbarItemSlot(mc.player.getInventory().selectedSlot), mod.settings.swap_delay.value, mc.player.yaw, mc.player.pitch)
          Client.eventManager.callEvent(new NotificationEvent("FT-Assistant", "Дезориентация использована", NotificationEvent.Severity.SUCCESS))
          interaction.clickSlot(mc.player.currentScreenHandler.syncId, disorientation.getIdForServer(mc.currentScreen), mc.player.getInventory().selectedSlot, SlotActionType.SWAP, mc.player)

          InventoryUtilsKt.closeInventorySilently()
        } else if (disorientation.slotType == ItemSlotType.HOTBAR) {
          SilentHotbat.INSTANCE.selectSlotSilently(this, disorientation, mod.settings.swap_delay.value)
          InventoryUtilsKt.useHotbarSlotOrOffhand(disorientation, mod.settings.swap_delay.value, mc.player.yaw, mc.player.pitch)
          Client.eventManager.callEvent(new NotificationEvent("FT-Assistant", "Дезориентация использована", NotificationEvent.Severity.SUCCESS))
        }

        current_slot = assitant_items.none
        break

      case assitant_items.dust: 
        const dust = Slots.All.findSlot(assitant_items.dust)
        if (!dust) {
          Client.eventManager.callEvent(new NotificationEvent("FT-Assistant", "Явная пыль не найдена", NotificationEvent.Severity.ERROR))
          current_slot = assitant_items.none
          return
        }

        if (dust.slotType == ItemSlotType.INVENTORY) {          
          InventoryUtilsKt.openInventorySilently()

          interaction.clickSlot(mc.player.currentScreenHandler.syncId, dust.getIdForServer(mc.currentScreen), mc.player.getInventory().selectedSlot, SlotActionType.SWAP, mc.player)

          InventoryUtilsKt.useHotbarSlotOrOffhand(new HotbarItemSlot(mc.player.getInventory().selectedSlot), mod.settings.swap_delay.value, mc.player.yaw, mc.player.pitch)
          Client.eventManager.callEvent(new NotificationEvent("FT-Assistant", "Явная пыль использована", NotificationEvent.Severity.SUCCESS))
          interaction.clickSlot(mc.player.currentScreenHandler.syncId, dust.getIdForServer(mc.currentScreen), mc.player.getInventory().selectedSlot, SlotActionType.SWAP, mc.player)

          InventoryUtilsKt.closeInventorySilently()
        } else if (dust.slotType == ItemSlotType.HOTBAR) {
          SilentHotbat.INSTANCE.selectSlotSilently(this, dust, mod.settings.swap_delay.value)
          InventoryUtilsKt.useHotbarSlotOrOffhand(dust, mod.settings.swap_delay.value, mc.player.yaw, mc.player.pitch)
          Client.eventManager.callEvent(new NotificationEvent("FT-Assistant", "Явная пыль использована", NotificationEvent.Severity.SUCCESS))
        }

        current_slot = assitant_items.none
        break

      case assitant_items.trap: 
        const trap = Slots.All.findSlot(assitant_items.trap)
        if (!trap) {
          Client.eventManager.callEvent(new NotificationEvent("FT-Assistant", "Трапка не найдена", NotificationEvent.Severity.ERROR))
          current_slot = assitant_items.none
          return
        }

        if (trap.slotType == ItemSlotType.INVENTORY) {          
          InventoryUtilsKt.openInventorySilently()

          interaction.clickSlot(mc.player.currentScreenHandler.syncId, trap.getIdForServer(mc.currentScreen), mc.player.getInventory().selectedSlot, SlotActionType.SWAP, mc.player)

          InventoryUtilsKt.useHotbarSlotOrOffhand(new HotbarItemSlot(mc.player.getInventory().selectedSlot), mod.settings.swap_delay.value, mc.player.yaw, mc.player.pitch)
          Client.eventManager.callEvent(new NotificationEvent("FT-Assistant", "Трапка использована", NotificationEvent.Severity.SUCCESS))
          interaction.clickSlot(mc.player.currentScreenHandler.syncId, trap.getIdForServer(mc.currentScreen), mc.player.getInventory().selectedSlot, SlotActionType.SWAP, mc.player)

          InventoryUtilsKt.closeInventorySilently()
        } else if (trap.slotType == ItemSlotType.HOTBAR) {
          SilentHotbat.INSTANCE.selectSlotSilently(this, trap, mod.settings.swap_delay.value)
          InventoryUtilsKt.useHotbarSlotOrOffhand(trap, mod.settings.swap_delay.value, mc.player.yaw, mc.player.pitch)
          Client.eventManager.callEvent(new NotificationEvent("FT-Assistant", "Трапка использована", NotificationEvent.Severity.SUCCESS))
        }

        current_slot = assitant_items.none
        break
      
      case assitant_items.aura: 
        const aura = Slots.All.findSlot(assitant_items.aura)
        if (!slot) {
          Client.eventManager.callEvent(new NotificationEvent("FT-Assistant", "Божья аура не найдена", NotificationEvent.Severity.ERROR))
          current_slot = assitant_items.none
          return
        }

        if (aura.slotType == ItemSlotType.INVENTORY) {          
          InventoryUtilsKt.openInventorySilently()

          interaction.clickSlot(mc.player.currentScreenHandler.syncId, aura.getIdForServer(mc.currentScreen), mc.player.getInventory().selectedSlot, SlotActionType.SWAP, mc.player)

          InventoryUtilsKt.useHotbarSlotOrOffhand(new HotbarItemSlot(mc.player.getInventory().selectedSlot), mod.settings.swap_delay.value, mc.player.yaw, mc.player.pitch)
          Client.eventManager.callEvent(new NotificationEvent("FT-Assistant", "Божья аура использована", NotificationEvent.Severity.SUCCESS))
          interaction.clickSlot(mc.player.currentScreenHandler.syncId, aura.getIdForServer(mc.currentScreen), mc.player.getInventory().selectedSlot, SlotActionType.SWAP, mc.player)

          InventoryUtilsKt.closeInventorySilently()
        } else if (aura.slotType == ItemSlotType.HOTBAR) {
          SilentHotbat.INSTANCE.selectSlotSilently(this, aura, mod.settings.swap_delay.value)
          InventoryUtilsKt.useHotbarSlotOrOffhand(aura, mod.settings.swap_delay.value, mc.player.yaw, mc.player.pitch)
          Client.eventManager.callEvent(new NotificationEvent("FT-Assistant", "Божья аура использована", NotificationEvent.Severity.SUCCESS))
        }

        current_slot = assitant_items.none
        break

      case assitant_items.tornado: 
        const tornado = Slots.All.findSlot(assitant_items.tornado)
        if (!tornado) {
          Client.eventManager.callEvent(new NotificationEvent("FT-Assistant", "Огненный смерч не найден", NotificationEvent.Severity.ERROR))
          current_slot = assitant_items.none
          return
        }

        if (tornado.slotType == ItemSlotType.INVENTORY) {          
          InventoryUtilsKt.openInventorySilently()

          interaction.clickSlot(mc.player.currentScreenHandler.syncId, tornado.getIdForServer(mc.currentScreen), mc.player.getInventory().selectedSlot, SlotActionType.SWAP, mc.player)

          InventoryUtilsKt.useHotbarSlotOrOffhand(new HotbarItemSlot(mc.player.getInventory().selectedSlot), mod.settings.swap_delay.value, mc.player.yaw, mc.player.pitch)
          Client.eventManager.callEvent(new NotificationEvent("FT-Assistant", "Огненный смерч использован", NotificationEvent.Severity.SUCCESS))
          interaction.clickSlot(mc.player.currentScreenHandler.syncId, tornado.getIdForServer(mc.currentScreen), mc.player.getInventory().selectedSlot, SlotActionType.SWAP, mc.player)

          InventoryUtilsKt.closeInventorySilently()
        } else if (tornado.slotType == ItemSlotType.HOTBAR) {
          SilentHotbat.INSTANCE.selectSlotSilently(this, tornado, mod.settings.swap_delay.value)
          InventoryUtilsKt.useHotbarSlotOrOffhand(tornado, mod.settings.swap_delay.value, mc.player.yaw, mc.player.pitch)
          Client.eventManager.callEvent(new NotificationEvent("FT-Assistant", "Огненный смерч использован", NotificationEvent.Severity.SUCCESS))
        }

        current_slot = assitant_items.none
        break

      case assitant_items.layer: 
        const layer = Slots.All.findSlot(assitant_items.layer)
        if (!layer) {
          Client.eventManager.callEvent(new NotificationEvent("FT-Assistant", "Пласт не найден", NotificationEvent.Severity.ERROR))
          current_slot = assitant_items.none
          return
        }

        if (layer.slotType == ItemSlotType.INVENTORY) {          
          InventoryUtilsKt.openInventorySilently()

          interaction.clickSlot(mc.player.currentScreenHandler.syncId, layer.getIdForServer(mc.currentScreen), mc.player.getInventory().selectedSlot, SlotActionType.SWAP, mc.player)

          InventoryUtilsKt.useHotbarSlotOrOffhand(new HotbarItemSlot(mc.player.getInventory().selectedSlot), mod.settings.swap_delay.value, mc.player.yaw, mc.player.pitch)
          Client.eventManager.callEvent(new NotificationEvent("FT-Assistant", "Пласт использован", NotificationEvent.Severity.SUCCESS))
          interaction.clickSlot(mc.player.currentScreenHandler.syncId, layer.getIdForServer(mc.currentScreen), mc.player.getInventory().selectedSlot, SlotActionType.SWAP, mc.player)

          InventoryUtilsKt.closeInventorySilently()
        } else if (layer.slotType == ItemSlotType.HOTBAR) {
          SilentHotbat.INSTANCE.selectSlotSilently(this, layer, mod.settings.swap_delay.value)
          InventoryUtilsKt.useHotbarSlotOrOffhand(layer, mod.settings.swap_delay.value, mc.player.yaw, mc.player.pitch)
          Client.eventManager.callEvent(new NotificationEvent("FT-Assistant", "Пласт использован", NotificationEvent.Severity.SUCCESS))
        }

        current_slot = assitant_items.none
        break
    }
  })

  mod.on("key", e => {
    if (e.getAction() != key_actions.down) {
      return
    }

    const translation_key = e.getKey().getTranslationKey()

    if (translation_key == mod.settings.disorientation.value) {
      current_slot = assitant_items.disorientation
    } else if (translation_key == mod.settings.dust.value) {
      current_slot = assitant_items.dust
    } else if (translation_key == mod.settings.trap.value) {
      current_slot = assitant_items.trap
    } else if (translation_key == mod.settings.aura.value) {
      current_slot = assitant_items.aura
    } else if (translation_key == mod.settings.tornado.value) {
      current_slot = assitant_items.tornado
    } else if (translation_key == mod.settings.layer.value) {
      current_slot = assitant_items.layer
    }
  })
});
