import { UserStatus } from "@prisma/client";
import prisma from "../../../shared/prisma";
import bcrypt from "bcrypt";
import { jwtHelpers } from "../../../helpers/jwtHelpers";
import config from "../../../config";
import ApiError from "../../errors/ApiError";
import httpStatus from "http-status";
import { Secret } from "jsonwebtoken";
import sendEmail from "./sendEmail";
const login = async (payload: { email: string; password: string }) => {
  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      email: payload.email,
      status: UserStatus.ACTIVE,
    },
  });

  const isPassMatched = await bcrypt.compare(
    payload.password,
    userData.password
  );

  if (!isPassMatched) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Password incorrect!");
  }

  const accessToken = jwtHelpers.generateToken(
    {
      email: userData.email,
      role: userData.role,
    },
    config.jwt.jwt_secret as string,
    config.jwt.expires_in as string
  );

  const refreshToken = jwtHelpers.generateToken(
    {
      email: userData.email,
      role: userData.role,
    },
    config.jwt.refresh_token_secret as string,
    config.jwt.refresh_token_expires_in as string
  );

  return {
    refreshToken,
    accessToken,
    needsPasswordChange: userData?.needsPasswordChange,
  };
};

const refreshToken = async (token: string) => {
  let decodedData;
  try {
    decodedData = jwtHelpers.verifyToken(
      token,
      config.jwt.refresh_token_secret as Secret
    );
  } catch (err) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "You are not authorized!");
  }

  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      email: decodedData.email,
      status: UserStatus.ACTIVE,
    },
  });

  const accessToken = jwtHelpers.generateToken(
    {
      email: userData.email,
      role: userData.role,
    },
    config.jwt.jwt_secret as string,
    config.jwt.expires_in as string
  );

  return {
    accessToken,
    needPasswordChange: userData.needsPasswordChange,
  };
};

const changePassword = async (
  user: any,
  payload: { newPassword: string; oldPassword: string }
) => {
  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      email: user.email,
      status: UserStatus.ACTIVE,
    },
  });

  const isPassMatched = await bcrypt.compare(
    payload.oldPassword,
    userData.password
  );

  if (!isPassMatched) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Password incorrect!");
  }

  const hashedPassword = await bcrypt.hash(payload.newPassword, 12);

  const result = await prisma.user.update({
    where: {
      email: user.email,
      status: UserStatus.ACTIVE,
    },
    data: {
      password: hashedPassword,
    },
  });

  return result;
};


const forgetPassword = async(payload:{email:string})=>{
    const userData = await prisma.user.findUniqueOrThrow({
        where: {
            email: payload.email,
            status: UserStatus.ACTIVE
        }
    })



    const resetPassToken = jwtHelpers.generateToken(
        { email: userData.email, role: userData.role },
        config.jwt.reset_pass_secret as Secret,
        config.jwt.reset_pass_token_expires_in as string
    )
    //console.log(resetPassToken)

    const resetPassLink = config.reset_pass_link + `?userId=${userData.id}&token=${resetPassToken}`

       await sendEmail(userData.email,
        `
        <div>
            <p>Dear User,</p>
            <p>Your password reset link 
                <a href=${resetPassLink}>
                    <button>
                        Reset Password
                    </button>
                </a>
            </p>

        </div>
        `
       ) 

}

const resetPassword = async (token: string, payload: { id: string, password: string }) => {
  console.log({ token, payload })

  const userData = await prisma.user.findUniqueOrThrow({
      where: {
          id: payload.id,
          status: UserStatus.ACTIVE
      }
  });

  const isValidToken = jwtHelpers.verifyToken(token, config.jwt.reset_pass_secret as Secret)

  if (!isValidToken) {
      throw new ApiError(httpStatus.FORBIDDEN, "Forbidden!")
  }

  // hash password
  const password = await bcrypt.hash(payload.password, 12);

  // update into database
  await prisma.user.update({
      where: {
          id: payload.id
      },
      data: {
          password
      }
  })
};


export const AuthServices = {
  login,
  refreshToken,
  changePassword,
  forgetPassword,

  resetPassword
};
