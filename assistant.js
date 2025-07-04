const script = registerScript({
  name: "FunTime-Assistant",
  version: "2.0.0",
  authors: ["Misha Sigma Gucci(tg - @mishasigmagucci)"]
});

const ClientChatKt = Java.type("net.ccbluex.liquidbounce.utils.client.ClientChat")
const Severity = Java.type("net.ccbluex.liquidbounce.event.events.NotificationEvent.Severity")
const Slots = Java.type("net.ccbluex.liquidbounce.utils.inventory.Slots")
const SilentHotbar = Java.type("net.ccbluex.liquidbounce.utils.client.SilentHotbar").INSTANCE
const InventoryUtilsKt = Java.type("net.ccbluex.liquidbounce.utils.inventory.InventoryUtilsKt")
const Items = Java.type("net.minecraft.item.Items")
const DataComponentTypes = Java.type("net.minecraft.component.DataComponentTypes")
const Colors = Java.type("net.minecraft.util.Colors")
const ItemSlotType = Java.type("net.ccbluex.liquidbounce.features.module.modules.player.invcleaner.ItemSlotType")
const HandType = Java.type("net.minecraft.util.Hand")
const UpdateSelectedSlotC2SPacket = Java.type("net.minecraft.network.packet.c2s.play.UpdateSelectedSlotC2SPacket")
const CollectionsKt = Java.type("kotlin.collections.CollectionsKt")
const ClickInventoryAction = Java.type("net.ccbluex.liquidbounce.utils.inventory.ClickInventoryAction").Companion
const PlayerInventoryConstraints = Java.type("net.ccbluex.liquidbounce.utils.inventory.PlayerInventoryConstraints")
const HotbarItemSlot = Java.type("net.ccbluex.liquidbounce.utils.inventory.HotbarItemSlot")
const Priority = Java.type("net.ccbluex.liquidbounce.utils.kotlin.Priority")

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

    swap_delay: Setting.intRange({
      name: "Swap delay",
      default: [0, 0],
      range: [0, 20]
    }),

    ah_helper: Setting.boolean({
      name: "Auction Helper",
      default: false
    }),

    smart_ah: Setting.boolean({
      name: "Smart AH Helper",
      default: true
    })
  }
}, (mod) => {
  mod.on("enable", (event) => {
    Client.displayChatMessage("disorientation - Дезориентация")
    Client.displayChatMessage("dust - Явная пыль")
    Client.displayChatMessage("trap - Трапка")
    Client.displayChatMessage("aura - Божья аура")
    Client.displayChatMessage("tornado - Огненный смерч")
    Client.displayChatMessage("layer - Пласт")
  })

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

  class itemSearchResult {
    constructor(slot, count) {  
      this.slot = slot
      this.count = count
    }
  }
  
  const constraints = new PlayerInventoryConstraints()

  constraints.startDelay = mod.settings.swap_delay
  constraints.clickDelay = mod.settings.swap_delay
  constraints.closeDelay = mod.settings.swap_delay


  function doSwapToHotbat(schedule_inventory_action_event, from, to) {  
    schedule_inventory_action_event.schedule(constraints, ClickInventoryAction.performSwap(null, from, to), Priority.IMPORTANT_FOR_USAGE_1)
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
          if (mod.settings.smart_ah) {
            price /= slot.getStack().getCount() 
          }
          if (price < lowest_price) {
            lowest_price = price
            lowest_price_item_pos.x = slot.x
            lowest_price_item_pos.y = slot.y
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

  const action_type = {
    none: 0,
    pickup_from_inventory: 1,
    use_from_hotbar: 2,
    back_to_inventory: 3
  }

  const helper_types = {
    disorientation: Items.ENDER_EYE,
    dust: Items.SUGAR,
    trap: Items.NETHERITE_SCRAP,
    aura: Items.PHANTOM_MEMBRANE,
    tornado: Items.FIRE_CHARGE,
    layer: Items.DRIED_KELP
  }

  use_disorientation = false
  use_dust = false
  use_trap = false
  use_aura = false
  use_tornado = false
  use_layer = false
  const slot_to_swap = new HotbarItemSlot(8)
  old_slot = null
  current_action = action_type.none
  mod.on("scheduleInventoryAction", (event) => {
    if (use_disorientation) {
      if (old_slot == null) {
        old_slot = Slots.All.findSlot(helper_types.disorientation)
        if (!old_slot) {
          use_disorientation = false
          ClientChatKt.notification("FT Assistant", "Дезориентация не найдена", Severity.ERROR)
          return
        }
      }

      switch (current_action) {
        case action_type.none:
          current_action = action_type.pickup_from_inventory
          return
          break;

        case action_type.pickup_from_inventory:
          doSwapToHotbat(event, old_slot, slot_to_swap)
          current_action = action_type.use_from_hotbar
          return
          break;
        
        case action_type.use_from_hotbar:
          SilentHotbar.selectSlotSilently(this, slot_to_swap, 1)
          InventoryUtilsKt.useHotbarSlotOrOffhand(slot_to_swap, 1, mc.player.yaw, mc.player.pitch)
          current_action = action_type.back_to_inventory
          return
          break;
        
        case action_type.back_to_inventory:
          doSwapToHotbat(event, old_slot, slot_to_swap)
          ClientChatKt.notification("FT Assistant", "Дезориентация использована", Severity.SUCCESS)
          use_disorientation = false
          old_slot = null
          current_action = action_type.none
          return
          break;
      }
    } else if (use_dust) {
      if (old_slot == null) {
        old_slot = Slots.All.findSlot(helper_types.dust)
        if (!old_slot) {
          use_dust = false
          ClientChatKt.notification("FT Assistant", "Явная пыль не найдена", Severity.ERROR)
          return
        }
      }

      switch (current_action) {
        case action_type.none:
          current_action = action_type.pickup_from_inventory
          return
          break;

        case action_type.pickup_from_inventory:
          doSwapToHotbat(event, old_slot, slot_to_swap)
          current_action = action_type.use_from_hotbar
          return
          break;
        
        case action_type.use_from_hotbar:
          SilentHotbar.selectSlotSilently(this, slot_to_swap, 1)
          InventoryUtilsKt.useHotbarSlotOrOffhand(slot_to_swap, 1, mc.player.yaw, mc.player.pitch)
          current_action = action_type.back_to_inventory
          return
          break;
        
        case action_type.back_to_inventory:
          doSwapToHotbat(event, old_slot, slot_to_swap)
          ClientChatKt.notification("FT Assistant", "Явная пыль использована", Severity.SUCCESS)
          use_dust = false
          old_slot = null
          current_action = action_type.none
          return
          break;
      }
    } else if (use_trap) {
      if (old_slot == null) {
        old_slot = Slots.All.findSlot(helper_types.trap)
        if (!old_slot) {
          use_trap = false
          ClientChatKt.notification("FT Assistant", "Трапка не найдена", Severity.ERROR)
          return
        }
      }

      switch (current_action) {
        case action_type.none:
          current_action = action_type.pickup_from_inventory
          return
          break;

        case action_type.pickup_from_inventory:
          doSwapToHotbat(event, old_slot, slot_to_swap)
          current_action = action_type.use_from_hotbar
          return
          break;
        
        case action_type.use_from_hotbar:
          SilentHotbar.selectSlotSilently(this, slot_to_swap, 1)
          InventoryUtilsKt.useHotbarSlotOrOffhand(slot_to_swap, 1, mc.player.yaw, mc.player.pitch)
          current_action = action_type.back_to_inventory
          return
          break;
        
        case action_type.back_to_inventory:
          doSwapToHotbat(event, old_slot, slot_to_swap)
          ClientChatKt.notification("FT Assistant", "Трапка использована", Severity.SUCCESS)
          use_trap = false
          old_slot = null
          current_action = action_type.none
          return
          break;
      }
    } else if (use_aura) {
      if (old_slot == null) {
        old_slot = Slots.All.findSlot(helper_types.aura)
        if (!old_slot) {
          use_aura = false
          ClientChatKt.notification("FT Assistant", "Божья аура не найдена", Severity.ERROR)
          return
        }
      }

      switch (current_action) {
        case action_type.none:
          current_action = action_type.pickup_from_inventory
          return
          break;

        case action_type.pickup_from_inventory:
          doSwapToHotbat(event, old_slot, slot_to_swap)
          current_action = action_type.use_from_hotbar
          return
          break;
        
        case action_type.use_from_hotbar:
          SilentHotbar.selectSlotSilently(this, slot_to_swap, 1)
          InventoryUtilsKt.useHotbarSlotOrOffhand(slot_to_swap, 1, mc.player.yaw, mc.player.pitch)
          current_action = action_type.back_to_inventory
          return
          break;
        
        case action_type.back_to_inventory:
          doSwapToHotbat(event, old_slot, slot_to_swap)
          ClientChatKt.notification("FT Assistant", "Божья аура использована", Severity.SUCCESS)
          use_aura = false
          old_slot = null
          current_action = action_type.none
          return
          break;
      }
    } else if (use_tornado) {
      if (old_slot == null) {
        old_slot = Slots.All.findSlot(helper_types.tornado)
        if (!old_slot) {
          use_tornado = false
          ClientChatKt.notification("FT Assistant", "Огненный смерч не найден", Severity.ERROR)
          return
        }
      }

      switch (current_action) {
        case action_type.none:
          current_action = action_type.pickup_from_inventory
          return
          break;

        case action_type.pickup_from_inventory:
          doSwapToHotbat(event, old_slot, slot_to_swap)
          current_action = action_type.use_from_hotbar
          return
          break;
        
        case action_type.use_from_hotbar:
          SilentHotbar.selectSlotSilently(this, slot_to_swap, 1)
          InventoryUtilsKt.useHotbarSlotOrOffhand(slot_to_swap, 1, mc.player.yaw, mc.player.pitch)
          current_action = action_type.back_to_inventory
          return
          break;
        
        case action_type.back_to_inventory:
          doSwapToHotbat(event, old_slot, slot_to_swap)
          ClientChatKt.notification("FT Assistant", "Огненный смерч использован", Severity.SUCCESS)
          use_tornado = false
          old_slot = null
          current_action = action_type.none
          return
          break;
      }
    } else if (use_layer) {
      if (old_slot == null) {
        old_slot = Slots.All.findSlot(helper_types.layer)
        if (!old_slot) {
          use_layer = false
          ClientChatKt.notification("FT Assistant", "Пласт не найден", Severity.ERROR)
          return
        }
      }

      switch (current_action) {
        case action_type.none:
          current_action = action_type.pickup_from_inventory
          return
          break;

        case action_type.pickup_from_inventory:
          doSwapToHotbat(event, old_slot, slot_to_swap)
          current_action = action_type.use_from_hotbar
          return
          break;
        
        case action_type.use_from_hotbar:
          SilentHotbar.selectSlotSilently(this, slot_to_swap, 1)
          InventoryUtilsKt.useHotbarSlotOrOffhand(slot_to_swap, 1, mc.player.yaw, mc.player.pitch)
          current_action = action_type.back_to_inventory
          return
          break;
        
        case action_type.back_to_inventory:
          doSwapToHotbat(event, old_slot, slot_to_swap)
          ClientChatKt.notification("FT Assistant", "Пласт использован", Severity.SUCCESS)
          use_layer = false
          old_slot = null
          current_action = action_type.none
          return
          break;
      }
    }
  })

  mod.on("key", (event) => {
    if (event.getAction() == 1 && mod.enabled) {
      if (event.getKey().getTranslationKey() == mod.settings.disorientation.value) {
        use_disorientation = true
      }
      
      if (event.getKey().getTranslationKey() == mod.settings.dust.value) {
        use_dust = true
      }

      if (event.getKey().getTranslationKey() == mod.settings.trap.value) {
        use_trap = true
      }

      if (event.getKey().getTranslationKey() == mod.settings.aura.value) {
        use_aura = true
      }

      if (event.getKey().getTranslationKey() == mod.settings.tornado.value) {
        use_tornado = true
      }

      if (event.getKey().getTranslationKey() == mod.settings.layer.value) {
        use_layer = true
      }
    }
  })
});
