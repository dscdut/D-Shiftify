import { useState } from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'
import { type z } from 'zod'

import { IconEye, IconNonEye } from '@/assets/icons'
import Logo from '@/components/logo/logo'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { PASSWORD_TYPE, TEXT_TYPE } from '@/core/configs/consts'
import { ROUTE } from '@/core/constants/path'
import { containerVariants, itemVariants } from '@/core/lib/variant/style-variant'
import { RegisterSchema } from '@/core/zod'
import { useAuthRedirect } from '@/hooks/auth/use-auth-redirect'
import { useRegisterAuth } from '@/hooks/tanstack-query/auth/use-query-auth'

const features = [
  { title: 'Tài khoản cá nhân', description: 'Quản lý thông tin và cài đặt của bạn' },
  { title: 'Bảo mật cao cấp', description: 'Bảo vệ dữ liệu của bạn với mã hóa tiên tiến' },
  { title: 'Hỗ trợ 24/7', description: 'Đội ngũ hỗ trợ luôn sẵn sàng giúp đỡ bạn' },
  { title: 'Cập nhật thường xuyên', description: 'Luôn được cập nhật những tính năng mới nhất' }
]

export default function Register() {
  const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false)
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState<boolean>(false)

  useAuthRedirect()

  const form = useForm<z.infer<typeof RegisterSchema>>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
      name: '',
      phone: ''
    }
  })

  const { mutate: mutationRegister, isPending } = useRegisterAuth()

  const handleRegister = () => {
    mutationRegister(form.getValues())
  }

  const togglePasswordVisibility = () => setIsPasswordVisible((prev) => !prev)
  const toggleConfirmPasswordVisibility = () => setIsConfirmPasswordVisible((prev) => !prev)

  return (
    <div className='flex justify-center w-full min-h-screen bg-workspace-gradient'>
      <div className='flex justify-between items-center px-4 mx-auto my-8 w-full max-w-7xl'>
        {/* Left side - Features */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className='hidden flex-col justify-center items-center space-y-8 w-full max-w-md lg:flex'
        >
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className='space-y-4 text-center'
          >
            <h2 className='text-3xl font-bold text-gray-900'>Tại sao chọn chúng tôi?</h2>
            <p className='text-gray-600'>Khám phá những lợi ích khi tham gia cùng chúng tôi</p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial='hidden'
            animate='visible'
            className='grid grid-cols-1 gap-6 w-full'
          >
            {features.map((feature) => (
              <motion.div
                key={feature.title}
                variants={itemVariants}
                className='flex flex-col p-6 bg-white rounded-xl shadow-md border border-brand-border transition-shadow duration-300 hover:shadow-lg'
              >
                <h3 className='mb-2 text-lg font-semibold text-gray-900'>{feature.title}</h3>
                <p className='text-gray-600'>{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className='mt-8 space-y-4 text-center'
          >
            <h3 className='text-xl font-semibold text-gray-900'>Cam kết của chúng tôi</h3>
            <ul className='space-y-2 text-gray-600'>
              <li>✨ Trải nghiệm người dùng tốt nhất</li>
              <li>🚀 Hiệu suất vượt trội</li>
              <li>🔒 Bảo mật tuyệt đối</li>
              <li>💡 Đổi mới liên tục</li>
            </ul>
          </motion.div>
        </motion.div>

        {/* Right side - Register Form */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className='flex flex-col p-8 space-y-6 w-full max-w-md bg-white/95 rounded-2xl shadow-lg border border-brand-border'
        >
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <Logo />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className='space-y-2'
          >
            <h1 className='text-4xl font-bold text-gray-900'>Tạo tài khoản</h1>
            <p className='text-gray-600'>Tham gia cùng chúng tôi ngay hôm nay</p>
          </motion.div>

          <Form {...form}>
            <motion.form
              variants={containerVariants}
              initial='hidden'
              animate='visible'
              onSubmit={form.handleSubmit(handleRegister)}
              className='space-y-6'
            >
              <motion.div variants={itemVariants}>
                <FormField
                  control={form.control}
                  name='email'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder='Nhập email của bạn' type='email' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </motion.div>

              <motion.div variants={itemVariants} className='flex gap-6 w-full'>
                <FormField
                  control={form.control}
                  name='name'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Họ và tên</FormLabel>
                      <FormControl>
                        <Input placeholder='Nhập họ và tên' {...field} className='w-full' />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='phone'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Số điện thoại</FormLabel>
                      <FormControl>
                        <Input placeholder='Nhập số điện thoại' {...field} className='w-full' maxLength={10} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </motion.div>

              <motion.div variants={itemVariants}>
                <FormField
                  control={form.control}
                  name={PASSWORD_TYPE}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mật khẩu</FormLabel>
                      <FormControl>
                        <Input
                          placeholder='Nhập mật khẩu của bạn'
                          className='w-full'
                          type={isPasswordVisible ? TEXT_TYPE : PASSWORD_TYPE}
                          {...field}
                          icon={isPasswordVisible ? <IconNonEye /> : <IconEye />}
                          iconOnClick={togglePasswordVisibility}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </motion.div>

              <motion.div variants={itemVariants}>
                <FormField
                  control={form.control}
                  name='confirmPassword'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Xác nhận mật khẩu</FormLabel>
                      <FormControl>
                        <Input
                          placeholder='Nhập lại mật khẩu của bạn'
                          className='w-full'
                          type={isConfirmPasswordVisible ? TEXT_TYPE : PASSWORD_TYPE}
                          {...field}
                          icon={isConfirmPasswordVisible ? <IconNonEye /> : <IconEye />}
                          iconOnClick={toggleConfirmPasswordVisibility}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </motion.div>

              <motion.div variants={itemVariants} className='flex items-center space-x-2'>
                <Checkbox id='terms' className='w-4 h-4' />
                <Label htmlFor='terms' className='text-sm text-gray-600 cursor-pointer'>
                  Tôi đồng ý với các <span className='text-brand-primary'>Điều khoản</span> và{' '}
                  <span className='text-brand-primary'>Chính sách bảo mật</span>
                </Label>
              </motion.div>

              <motion.div variants={itemVariants}>
                <Button
                  loading={isPending}
                  className='w-full text-white bg-brand-primary transition-all duration-300 hover:bg-brand-primary-hover hover:shadow-lg'
                  type='submit'
                >
                  Tạo tài khoản
                </Button>
              </motion.div>

              <motion.p variants={itemVariants} className='text-sm text-center text-gray-600'>
                Đã có tài khoản?{' '}
                <Link
                  to={ROUTE.PUBLIC.LOGIN}
                  className='font-medium text-brand-primary hover:text-brand-primary-hover hover:underline'
                >
                  Đăng nhập ngay
                </Link>
              </motion.p>
            </motion.form>
          </Form>
        </motion.div>
      </div>
    </div>
  )
}
