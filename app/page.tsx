'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { FaPalette, FaUsers, FaCalendarAlt, FaStar } from 'react-icons/fa';

export default function HomePage() {
  return (
    <div className="min-h-screen md:ml-72">
      <section className=" h-[600px] bg-gradient-to-r from-purple-600 to-blue-500">
        <div className="relative h-full flex items-center justify-center text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-white px-4"
          >
            <h1 className="text-6xl font-bold mb-4">Studio 53</h1>
            <p className="text-xl mb-8">Раскройте свой творческий потенциал</p>
            <Link
              href="/groups"
              className="bg-white text-purple-600 px-8 py-3 rounded-full font-semibold hover:bg-purple-100 transition-colors duration-300"
            >
              Записаться на занятия
            </Link>
          </motion.div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-16 text-gray-900">
            Почему выбирают нас
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="p-6 bg-white rounded-xl shadow-lg text-center"
            >
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaPalette className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900">Профессионал преподаватель</h3>
              <p className="text-gray-600">Опытная мастер своего дела</p>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              className="p-6 bg-white rounded-xl shadow-lg text-center"
            >
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaUsers className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900">Небольшие группы</h3>
              <p className="text-gray-600">Индивидуальный подход к каждому</p>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              className="p-6 bg-white rounded-xl shadow-lg text-center"
            >
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaCalendarAlt className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900">Гибкое расписание</h3>
              <p className="text-gray-600">Занятия в удобное время</p>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              className="p-6 bg-white rounded-xl shadow-lg text-center"
            >
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaStar className="w-8 h-8 text-yellow-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900">Оборудование включено</h3>
              <p className="text-gray-600">Все необходимое для творчества</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Classes Preview Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-16 text-gray-900">
            Направления студии
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-white rounded-xl overflow-hidden shadow-lg"
            >
              <div className="h-48 bg-purple-200"></div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2 text-gray-900">Живопись для детей</h3>
                <p className="text-gray-600 mb-4">
                  Обучение различным техникам живописи для всех уровней
                </p>
                <Link
                  href="/groups"
                  className="text-purple-600 font-semibold hover:text-purple-700"
                >
                  Подробнее →
                </Link>
              </div>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-white rounded-xl overflow-hidden shadow-lg"
            >
              <div className="h-48 bg-blue-200"></div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2 text-gray-900">Проведение мероприятий</h3>
                <p className="text-gray-600 mb-4">
                  Проведение мероприятий для детей и взрослых
                </p>
                <Link
                  href="/groups"
                  className="text-purple-600 font-semibold hover:text-purple-700"
                >
                  Подробнее →
                </Link>
              </div>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-white rounded-xl overflow-hidden shadow-lg"
            >
              <div className="h-48 bg-green-200"></div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2 text-gray-900">Мастер-классы</h3>
                <p className="text-gray-600 mb-4">
                  Арт-свидания, роспись мишек, девичники и многое другое
                </p>
                <Link
                  href="/groups"
                  className="text-purple-600 font-semibold hover:text-purple-700"
                >
                  Подробнее →
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-purple-600 to-blue-500 text-white">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-4xl font-bold mb-8">Готовы начать свой творческий путь?</h2>
          <p className="text-xl mb-12">
            Присоединяйтесь к нашей студии и откройте для себя мир искусства
          </p>
          <Link
            href="/groups"
            className="bg-white text-purple-600 px-8 py-3 rounded-full font-semibold hover:bg-purple-100 transition-colors duration-300"
          >
            Записаться на пробное занятие
          </Link>
        </div>
      </section>
    </div>
  );
}
