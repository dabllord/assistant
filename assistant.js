const script = registerScript({
  name: "FT-Assistant",
  version: "4.0.0",
  authors: ["Misha Sigma Gucci (tg - @mishasigmagucci)"]
});

const NotificationEvent = Java.type("net.ccbluex.liquidbounce.event.events.NotificationEvent")
const Slots = Java.type("net.ccbluex.liquidbounce.utils.inventory.Slots")
const Items = Java.type("net.minecraft.item.Items")
const ItemSlotType = Java.type("net.ccbluex.liquidbounce.features.module.modules.player.invcleaner.ItemSlotType")
const ClickInventoryAction = Java.type("net.ccbluex.liquidbounce.utils.inventory.ClickInventoryAction")
const HotbarItemSlot = Java.type("net.ccbluex.liquidbounce.utils.inventory.HotbarItemSlot")
const InventoryUtilsKt = Java.type("net.ccbluex.liquidbounce.utils.inventory.InventoryUtilsKt")
const SilentHotbat = Java.type("net.ccbluex.liquidbounce.utils.client.SilentHotbar")
const SlotActionType = Java.type("net.minecraft.screen.slot.SlotActionType")
const FontManager = Java.type("net.ccbluex.liquidbounce.render.FontManager")
const Color4b = Java.type("net.ccbluex.liquidbounce.render.engine.type.Color4b")
const Vec3 = Java.type("net.ccbluex.liquidbounce.render.engine.type.Vec3")
const RenderShortcutsKt = Java.type("net.ccbluex.liquidbounce.render.RenderShortcutsKt")
const FontRendererBuffers = Java.type("net.ccbluex.liquidbounce.render.engine.font.FontRendererBuffers")

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
  current_item = assitant_items.none
  
  mod.on("gameTick", e => {
    const interaction =  mc.interactionManager
    switch (current_item) {
      case assitant_items.disorientation: 
        const disorientation = Slots.All.findSlot(assitant_items.disorientation)
        if (!disorientation) {
          Client.eventManager.callEvent(new NotificationEvent("FT-Assistant", "Дезориентация не найдена", NotificationEvent.Severity.ERROR))
          current_item = assitant_items.none
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

        current_item = assitant_items.none
        break

      case assitant_items.dust: 
        const dust = Slots.All.findSlot(assitant_items.dust)
        if (!dust) {
          Client.eventManager.callEvent(new NotificationEvent("FT-Assistant", "Явная пыль не найдена", NotificationEvent.Severity.ERROR))
          current_item = assitant_items.none
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

        current_item = assitant_items.none
        break

      case assitant_items.trap: 
        const trap = Slots.All.findSlot(assitant_items.trap)
        if (!trap) {
          Client.eventManager.callEvent(new NotificationEvent("FT-Assistant", "Трапка не найдена", NotificationEvent.Severity.ERROR))
          current_item = assitant_items.none
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

        current_item = assitant_items.none
        break
      
      case assitant_items.aura: 
        const aura = Slots.All.findSlot(assitant_items.aura)
        if (!aura) {
          Client.eventManager.callEvent(new NotificationEvent("FT-Assistant", "Божья аура не найдена", NotificationEvent.Severity.ERROR))
          current_item = assitant_items.none
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

        current_item = assitant_items.none
        break

      case assitant_items.tornado: 
        const tornado = Slots.All.findSlot(assitant_items.tornado)
        if (!tornado) {
          Client.eventManager.callEvent(new NotificationEvent("FT-Assistant", "Огненный смерч не найден", NotificationEvent.Severity.ERROR))
          current_item = assitant_items.none
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

        current_item = assitant_items.none
        break

      case assitant_items.layer: 
        const layer = Slots.All.findSlot(assitant_items.layer)
        if (!layer) {
          Client.eventManager.callEvent(new NotificationEvent("FT-Assistant", "Пласт не найден", NotificationEvent.Severity.ERROR))
          current_item = assitant_items.none
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

        current_item = assitant_items.none
        break
    }
  })

  mod.on("key", e => {
    if (e.getAction() != key_actions.down) {
      return
    }

    const translation_key = e.getKey().getTranslationKey()

    if (translation_key == mod.settings.disorientation.value) {
      current_item = assitant_items.disorientation
    } else if (translation_key == mod.settings.dust.value) {
      current_item = assitant_items.dust
    } else if (translation_key == mod.settings.trap.value) {
      current_item = assitant_items.trap
    } else if (translation_key == mod.settings.aura.value) {
      current_item = assitant_items.aura
    } else if (translation_key == mod.settings.tornado.value) {
      current_item = assitant_items.tornado
    } else if (translation_key == mod.settings.layer.value) {
      current_item = assitant_items.layer
    }
  })

  mod.on("disable", () => {
    current_item = assitant_items.none
  })

  function formatKeybind(key) {
    if (key.value.toString() == "key.keyboard.unknown") {
      return ""
    }

    return key.value.toString().replace("key.keyboard.", "")
  }

  function draw_keybind(font_renderer, setting, x) {
    const text = font_renderer.process(formatKeybind(setting), Color4b.Companion.WHITE)
    font_renderer.draw(text, Primitives.float(x - (font_renderer.getStringWidth(text, false) * 0.2) / 2), 18, false, 0, Primitives.float("0.2"))
  }

  mod.on("overlayRender", e => {
    const ctx = e.getContext()
    const matrices = e.getContext().getMatrices()
    const font_renderer = FontManager.INSTANCE.FONT_RENDERER

    RenderShortcutsKt.renderEnvironmentForGUI(matrices, env => {
      env.withMatrixStack(() => {
        matrices.translate((e.getContext().getScaledWindowWidth() - 110) / 2, e.getContext().getScaledWindowHeight() / 2 + 50, 0)
        
        RenderShortcutsKt.withColor(env, new Color4b(26, 24, 24, 167), () => {
          RenderShortcutsKt.drawQuad(env, new Vec3(0, 0, 0), new Vec3(110, 20, 0))
        })

        RenderShortcutsKt.withColor(env, new Color4b(26, 24, 24, 255), () => {
          RenderShortcutsKt.drawQuadOutlines(env, new Vec3(0, 0, 0), new Vec3(110, 20, 0))
        })

        aligment = 2
        for (k in assitant_items) {
          if (assitant_items[k] == assitant_items.none) {
            continue
          }

          item_stack = Slots.All.findSlot(assitant_items[k])
          if (item_stack) {
            item_stack = item_stack.itemStack
          } else {
            item_stack = assitant_items[k].getDefaultStack()
          }

          ctx.drawItem(item_stack, aligment, 2)

          aligment += 18
        }

        const buffers = new FontRendererBuffers()
        try {
          draw_keybind(font_renderer, mod.settings.disorientation, 10)
          draw_keybind(font_renderer, mod.settings.dust, 28)
          draw_keybind(font_renderer, mod.settings.trap, 46)
          draw_keybind(font_renderer, mod.settings.aura, 64)
          draw_keybind(font_renderer, mod.settings.tornado, 82)
          draw_keybind(font_renderer, mod.settings.layer, 100)
          env.commit(font_renderer, buffers)
        } finally {
          buffers.draw()
        }
      })
    })
  })
});
