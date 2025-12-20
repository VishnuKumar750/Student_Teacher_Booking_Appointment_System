import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

const ProfilePage = ({ role, data }) => {
  const { fullName, email, department, course, subject, phone, address, image } = data;

  const fields = [
    { label: 'Full Name', value: fullName },
    { label: 'Email', value: email },
    ...(role !== 'admin' ? [{ label: 'Department', value: department }] : []),
    ...(role !== 'admin' ? [{ label: 'Course', value: course }] : []),
    ...(role === 'teacher' ? [{ label: 'Subject', value: subject }] : []),
    { label: 'Phone No.', value: phone },
    { label: 'Address', value: address },
  ];

  return (
    <div className="p-10 max-w-6xl mx-auto">
      {/* PAGE TITLE */}
      <h2 className="text-4xl font-bold mb-10 tracking-tight">Profile</h2>

      {/* MAIN WRAPPER WITHOUT CARD LOOK */}
      <div className="flex flex-col md:flex-row gap-16">
        {/* LEFT SECTION */}
        <div className="flex flex-col items-center md:w-1/3 gap-6">
          <Avatar className="h-52 w-52 ring-4 ring-gray-200 dark:ring-neutral-700">
            <AvatarImage src={image} />
            <AvatarFallback className="text-3xl">
              {fullName?.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>

          <p className="text-2xl font-semibold">{fullName}</p>
          <p className="text-lg text-muted-foreground">{email}</p>
        </div>

        {/* RIGHT SECTION */}
        <div className="md:w-2/3 grid grid-cols-1 sm:grid-cols-2 gap-8 text-lg">
          {fields.map(
            (field, index) =>
              field.value && (
                <div key={index} className="space-y-1">
                  <p className="text-base text-muted-foreground">{field.label}</p>
                  <p className="font-semibold text-xl">{field.value}</p>
                </div>
              )
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
