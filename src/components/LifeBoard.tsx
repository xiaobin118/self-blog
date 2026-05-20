import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface LifeItem {
  title: string;
  detail: string;
}

interface LifeSection {
  id: string;
  title: string;
  icon: string;
  items: LifeItem[];
}

const sections: LifeSection[] = [
  {
    id: 'music',
    title: 'Music',
    icon: '♫',
    items: [
      { title: 'Diverse System', detail: '极爱Diverse System，新出的AD PIANOX 高兴了一整天，喜欢日式同人音乐，喜欢听钢琴曲，偶尔听听一些Hardcore' },
      { title: '"Immutable" by Juggernaut', detail: '一首future bass，"生存的证明是沉眠"，万物沉寂沉睡，熬过离别和遗憾。就像寒冬过后冰雪融化，春天悄悄从废墟里冒出来，安静蛰伏只为积蓄力量，整首歌温柔又治愈，满是静待新生的希望' },
      { title: '"ピアノ三重奏" by Sakuzyo', detail: '在高考上考场前，听这首曲字抚平焦虑，在钢琴和弦乐的交织中顺利答完题目。自由不羁，但又总能找到秩序的美感' },
      { title: '"輪廻" by ARForest', detail: '温柔又宏厚的弦乐，在诉说着生命的轮回和不息的希望，仿佛能听到森林万物的呼吸，歌唱，声声不息' },
    ],
  },
  {
    id: 'art',
    title: 'Art',
    icon: '🎨',
    items: [
      { title: '二次元文化', detail: '看看漫画，追追番。极乐幻奇谭，血族Bloodline，一拳超人... 各种类型的漫画都有所涉猎' },
      { title: 'Claude Monet', detail: '极爱印象派，色彩和光影的运用让人沉醉！快看，他的画好像在呼吸！' },
      { title: '电影', detail: '不怎么看电影（也许是时间太长了...）' },
    ],
  },
  {
    id: 'game',
    title: 'Game',
    icon: '🎮',
    items: [
      { title: "Girls' Frontline", detail: '从初中开始玩的陈年老游，剧情和设定夯爆了！美术也好看！It is a true masterpiece in waifu game!' },
      { title: '坎公骑冠剑', detail: '剧情也夯，也是希望他能一直更下去吧' },
      { title: '音游', detail: '虽然现在玩的少了，CytusII，Deemo 音乐都很好听，雷亚你干得好啊！' },
    ],
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

function CollapsibleSection({ section }: { section: LifeSection }) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <motion.div
      variants={itemVariants}
      className="bg-card-light dark:bg-card-dark rounded-2xl border border-border-light dark:border-border-dark overflow-hidden transition-colors duration-300 hover:shadow-lg"
      whileHover={{ scale: 1.02 }}
    >
      {/* Header */}
      <button
        onClick={() => setIsOpen(prev => !prev)}
        className="w-full flex items-center justify-between p-5 cursor-pointer hover:bg-bg-light/50 dark:hover:bg-bg-dark/50 transition-colors duration-300"
      >
        <div className="flex items-center gap-3">
          <span className="text-2xl">{section.icon}</span>
          <h3 className="text-lg font-bold text-heading-light dark:text-heading-dark">
            {section.title}
          </h3>
          <span className="text-sm text-text-light dark:text-text-dark">
            ({section.items.length})
          </span>
        </div>
        <motion.svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="text-text-light dark:text-text-dark"
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <path d="m6 9 6 6 6-6" />
        </motion.svg>
      </button>

      {/* Content with collapse animation */}
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 flex flex-col gap-2">
              {section.items.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-start gap-3 p-3 rounded-lg hover:bg-bg-light/50 dark:hover:bg-bg-dark/50 transition-colors duration-300 group"
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-accent-light dark:bg-accent-dark mt-2 shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-heading-light dark:text-heading-dark group-hover:text-accent-light dark:group-hover:text-accent-dark transition-colors duration-300">
                      {item.title}
                    </p>
                    <p className="text-xs text-text-light dark:text-text-dark mt-0.5">
                      {item.detail}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function LifeBoard() {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
    >
      {sections.map(section => (
        <CollapsibleSection key={section.id} section={section} />
      ))}
    </motion.div>
  );
}
