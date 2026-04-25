import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const QGiftModule = buildModule("QGiftModule", (m) => {
  const qgift = m.contract("QGift");
  return { qgift };
});

export default QGiftModule;
